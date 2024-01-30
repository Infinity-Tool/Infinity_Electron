import {
  Box,
  Button,
  LinearProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttpContext } from '../Services/http/HttpContext';
import ConfirmationDialog from '../Components/ConfirmationDialog';
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { LoadingMessages } from '../Services/LoadingMessages';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import { useSelectionContext } from '../Services/SelectionContext';
import { InstallationFile } from '../Models/InstallationFile';

export default function Installation() {
  const router = useNavigate();
  const theme = useTheme();
  const { ipcRenderer } = window.electron;
  const { baseUrl } = useHttpContext();
  const directory = GetDirectoryFileQuery();
  const availableStep0Files = directory.data?.step_0;
  const availableStep1Files = directory.data?.step_1;
  const availableStep2Files = directory.data?.step_2;
  const availableStep3Files = directory.data?.step_3;
  const availableStep4Files = directory.data?.step_4;
  const [fileCount, setFileCount]: any = useState();
  const {
    moddedInstall,
    installMethod,
    modsDirectory,
    localPrefabsDirectory,
    step1Selection,
    step2Selection,
    step3Selection,
    step4Selection,
  } = useSelectionContext();
  const [filesCompleted, setFilesCompleted]: any = useState([]);
  const [filesErrored, setFilesErrored]: any = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [startTime, setStartTime]: any = useState(new Date());

  const [confirmBackOpen, setConfirmBackOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const downloadPercentCompleted = useMemo(() => {
    const totalFiles = fileCount;
    const completedFiles = filesCompleted.length;
    const erroredFiles = filesErrored.length;
    const percent =
      ((completedFiles ?? 0 + erroredFiles ?? 0) / totalFiles ?? 0) * 100;
    return percent ?? 0;
  }, [filesCompleted]);

  const downloadEstimatedTime = useMemo(() => {
    const currentTime = Date.now();
    const elapsedTimeMs = currentTime - (startTime ?? 0);

    // if elapsed is say 20minutes and we are 50% done, then remaining is 20/50% = 40minutes

    const remainingTimeMs =
      (elapsedTimeMs / (downloadPercentCompleted / 100)) *
      (1 - downloadPercentCompleted / 100);

    const remaining = {
      hours: Math.floor(remainingTimeMs / 3600000),
      minutes: Math.floor((remainingTimeMs % 3600000) / 60000),
    };
    return remaining;
  }, [downloadPercentCompleted]);

  const startDownloads = () => {
    setStartTime(Date.now());
    let allFiles = [];

    if (moddedInstall) {
      const step0Files = buildFileLists(
        availableStep0Files,
        availableStep0Files.map((a: any) => ({
          name: a.name,
          childSelections: a.childSelections.map((b: any) => b.name),
        })),
      );
      const step1Files = buildFileLists(availableStep1Files, step1Selection);
      const step2Files = buildFileLists(availableStep2Files, step2Selection);
      const step3Files = buildFileLists(availableStep3Files, step3Selection);
      // allFiles.push(...step0Files, ...step1Files, ...step2Files, ...step3Files);
      allFiles = [...step0Files, ...step1Files, ...step2Files, ...step3Files];
    } else {
      const requiredStep4Files = { name: '_Required', childSelections: [] };
      const newStep4Selection = step4Selection.concat(requiredStep4Files);
      const step4Files = buildFileLists(availableStep4Files, newStep4Selection);
      allFiles = [...step4Files];
    }

    setFileCount(allFiles.length);

    const filesPreppedForDownload = allFiles.map((file: any) => {
      const directoryWithoutFileName = file.destination.substring(
        0,
        file.destination.lastIndexOf('/'),
      );
      return {
        url: file.source,
        properties: {
          directory: directoryWithoutFileName,
          fileName: file.fileName,
          overwrite: true,
          openFolderWhenDone: false,
          showBadge: false,
          showProgressBar: false,
        },
      };
    });

    ipcRenderer.sendMessage(
      'queue-files-for-download',
      filesPreppedForDownload,
    );
  };

  const buildFileLists = (
    availableFiles: any,
    selectedFiles: any,
  ): InstallationFile[] => {
    let formattedInstallationFiles: any = [];

    selectedFiles.forEach((selected: any) => {
      const foundEntry = availableFiles.find(
        (available: any) => selected.name === available.name,
      );

      if (foundEntry) {
        const mods = foundEntry.mods;
        const localPrefabs = foundEntry.localPrefabs;

        FormatAndAddModFiles(mods, formattedInstallationFiles);
        FormatAndAddLocalPrefabFiles(localPrefabs, formattedInstallationFiles);

        if (selected.childSelections.length > 0) {
          selected.childSelections.forEach((child: any) => {
            const foundChildEntry = foundEntry.childSelections.find(
              (availableChild: any) => child === availableChild.name,
            );

            if (foundChildEntry) {
              const mods = foundChildEntry.mods;
              const localPrefabs = foundChildEntry.localPrefabs;

              FormatAndAddModFiles(mods, formattedInstallationFiles);
              FormatAndAddLocalPrefabFiles(
                localPrefabs,
                formattedInstallationFiles,
              );
            }
          });
        }
      }
    });

    return formattedInstallationFiles;
  };

  const updateLoadingMessage = () => {
    if (downloadPercentCompleted && downloadPercentCompleted < 100) {
      const randomLoadingMessage =
        LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)];
      setLoadingMessage(randomLoadingMessage);

      setTimeout(() => {
        updateLoadingMessage();
      }, 10000);
    }
  };

  // Effects
  useEffect(() => {
    startDownloads();
    updateLoadingMessage();
  }, []);

  useEffect(() => {
    if (downloadPercentCompleted >= 100) {
      navigateFinished();
    }
  }, [downloadPercentCompleted]);

  useEffect(() => {
    ipcRenderer.on('download-complete', (event: any, file: any) => {
      addToCompletedFiles(file);
    });
    ipcRenderer.on('download-error', (event: any, file: any) => {
      addToErroredFiles(file);
    });
    return () => {
      ipcRenderer.removeAllListeners('download-complete');
      ipcRenderer.removeAllListeners('download-error');
    };
  }, [ipcRenderer]);

  const onBackClick = (event: any) => {
    setConfirmBackOpen(true);
  };

  const onCancelClick = (event: any) => {
    setConfirmCancelOpen(true);
  };

  const cancelCurrentDownloadQueue = () => {
    ipcRenderer.sendMessage('download-cancel');
  };

  const cancelInstallAndGoBack = () => {
    cancelCurrentDownloadQueue();
    if (moddedInstall) router(AppRoutes.citiesAndSettlements);
    else router(AppRoutes.vanillaPois);
  };

  const cancelInstallationAndGoCanceledPage = () => {
    cancelCurrentDownloadQueue();
    router(AppRoutes.canceled);
  };

  const navigateFinished = () => {
    router(AppRoutes.finished);
  };

  const addToCompletedFiles = (file: string) => {
    setFilesCompleted((prev: any) => [...prev, file]);
  };

  const addToErroredFiles = (file: string) => {
    setFilesErrored((prev: any) => [...prev, file]);
  };

  //Styles
  const percentDoneStyles = {
    width: '100%',
    fontSize: '3rem',
    textAlign: 'center',
  };
  const loadingMessageStyles = {
    my: theme.spacing(2),
    width: '100%',
    fontSize: '1.5rem',
    textAlign: 'center',
  };

  return (
    <>
      <Box sx={pageContainerStyles}>
        <Box sx={pageContentStyles}>
          <Typography>
            {JSON.stringify(downloadEstimatedTime)}
            remaining
          </Typography>

          <Typography variant="h1" sx={percentDoneStyles}>
            {downloadPercentCompleted.toFixed(1) || 0}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={downloadPercentCompleted ?? 0}
          ></LinearProgress>

          <Typography sx={loadingMessageStyles}>{loadingMessage}</Typography>
        </Box>
        <Box sx={pageFooterStyles}>
          <Button onClick={onBackClick}>Back</Button>
          <Button onClick={onCancelClick}>Cancel</Button>
        </Box>
      </Box>

      {/* Back Dialog */}
      <ConfirmationDialog
        open={confirmBackOpen}
        onCancel={() => {
          setConfirmBackOpen(false);
        }}
        onConfirm={() => cancelInstallAndGoBack()}
        promptTitle={'Are you sure you want to go back to selection?'}
        promptDescription={'This will cancel the installation.'}
      />

      {/* Cancel Dialog */}
      <ConfirmationDialog
        open={confirmCancelOpen}
        onCancel={() => {
          setConfirmCancelOpen(false);
        }}
        onConfirm={() => cancelInstallationAndGoCanceledPage()}
        promptTitle={'Are you sure you want to cancel the installation?'}
      />
    </>
  );

  function FormatAndAddLocalPrefabFiles(
    localPrefabs: any,
    formattedInstallationFiles: any,
  ) {
    localPrefabs.forEach((localPrefab: any) => {
      const fileName = localPrefab.destination.substring(
        localPrefab.destination.lastIndexOf('/') + 1,
      );
      const installationFile = new InstallationFile(
        `${baseUrl}/${localPrefab.source}`,
        `${localPrefabsDirectory}/${localPrefab.destination}`,
        fileName,
      );
      formattedInstallationFiles.push(installationFile);
    });
  }

  function FormatAndAddModFiles(mods: any, formattedInstallationFiles: any) {
    mods.forEach((mod: any) => {
      const fileName = mod.destination.substring(
        mod.destination.lastIndexOf('/') + 1,
      );
      const installationFile = new InstallationFile(
        `${baseUrl}/${mod.source}`,
        `${modsDirectory}/${mod.destination}`,
        fileName,
      );
      formattedInstallationFiles.push(installationFile);
    });
  }
}
