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
import {
  InstallMethod,
  useSelectionContext,
} from '../Services/SelectionContext';
import { InstallationFile } from '../Models/InstallationFile';
import { InstallationRequest } from '../Models/InstallationRequest';
import Slideshow from '../Components/Slideshow';

export default function Installation() {
  const router = useNavigate();
  const theme = useTheme();
  const { ipcRenderer } = window.electron;
  const { baseUrl } = useHttpContext();
  const directoryQuery = GetDirectoryFileQuery();
  const availableStep0FilesModded = directoryQuery.data?.step_0_modded;
  const availableStep0FilesUnmodded = directoryQuery.data?.step_0_unmodded;
  const availableStep1Files = directoryQuery.data?.step_1;
  const availableStep2Files = directoryQuery.data?.step_2;
  const availableStep3Files = directoryQuery.data?.step_3;
  const availableStep4Files = directoryQuery.data?.step_4;
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
  const [downloadsStarted, setDownloadsStarted] = useState(false);
  const [confirmBackOpen, setConfirmBackOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cleanInstallError, setCleanInstallError] = useState<string>('');

  const downloadPercentCompleted = useMemo(() => {
    const totalFiles = fileCount;
    const completedFiles = filesCompleted.length ?? 0;
    const erroredFiles = filesErrored.length ?? 0;

    if (totalFiles === 0) return 0;
    if (completedFiles + erroredFiles === 0) return 0;

    const percent = ((completedFiles + erroredFiles) / totalFiles ?? 0) * 100;
    return percent ?? 0;
  }, [filesCompleted, filesErrored]);

  const downloadEstimatedTime = useMemo(() => {
    if (installMethod == InstallMethod.quickInstall) {
      return '';
    }
    if (downloadPercentCompleted < 2) {
      return 'Estimating time...';
    }
    const currentTime = Date.now();
    const elapsedTimeMs = currentTime - (startTime ?? 0);
    const remainingTimeMs =
      (elapsedTimeMs / (downloadPercentCompleted / 100)) *
      (1 - downloadPercentCompleted / 100);
    const minutes = Math.floor(remainingTimeMs / 60000);

    if (minutes > 180) return 'This is gonna take a while';
    if (minutes > 120) return 'Over two hours remaining';
    if (minutes > 60) return 'At least an hour to go';
    if (minutes < 1) return 'Less than a minute remaining';
    else return `About ${minutes + 1} minutes remaining`;
  }, [downloadPercentCompleted]);

  const startDownloads = () => {
    setStartTime(Date.now());
    let allFiles = [];

    if (moddedInstall) {
      const step0FilesModded = buildFileLists(
        availableStep0FilesModded,
        availableStep0FilesModded.map((a: any) => ({
          name: a.name,
          childSelections: a.childSelections.map((b: any) => b.name),
        })),
      );
      const step1Files = buildFileLists(availableStep1Files, step1Selection);
      const step2Files = buildFileLists(availableStep2Files, step2Selection);
      const step3Files = buildFileLists(availableStep3Files, step3Selection);
      allFiles = [
        ...step0FilesModded,
        ...step1Files,
        ...step2Files,
        ...step3Files,
      ];
      console.log('allFiles', allFiles);
    } else {
      //Unmodded install
      const step0FilesUnModded = buildFileLists(
        availableStep0FilesUnmodded,
        availableStep0FilesUnmodded.map((a: any) => ({
          name: a.name,
          childSelections: a.childSelections.map((b: any) => b.name),
        })),
      );
      const step4Files = buildFileLists(availableStep4Files, step4Selection);
      allFiles = [...step0FilesUnModded, ...step4Files];
    }
    setFileCount(allFiles.length);

    if (modsDirectory == null || localPrefabsDirectory == null) {
      alert('Error: Mods and local prefabs directories are not set.');
      return;
    }

    const request: InstallationRequest = {
      modsDirectory,
      localPrefabsDirectory,
      files: allFiles.reverse(),
      installMethod,
    };

    ipcRenderer.sendMessage('queue-files-for-download', request);
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
    const randomLoadingMessage =
      LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)];
    setLoadingMessage(randomLoadingMessage);

    setTimeout(() => {
      updateLoadingMessage();
    }, 20000);
  };

  // Effects
  useEffect(() => {
    if (directoryQuery.isSuccess && !downloadsStarted) {
      setDownloadsStarted(true);
      startDownloads();
      updateLoadingMessage();
    }
  }, [directoryQuery]);

  useEffect(() => {
    if (downloadPercentCompleted >= 100) {
      navigateFinished();
    }
  }, [downloadPercentCompleted]);

  useEffect(() => {
    ipcRenderer.on('download-complete', (file: any) => {
      addToCompletedFiles(file);
    });
    ipcRenderer.on('download-error', (file: any) => {
      addToErroredFiles(file);
    });
    return () => {
      ipcRenderer.removeAllListeners('download-complete');
      ipcRenderer.removeAllListeners('download-error');
    };
  }, [ipcRenderer]);

  useEffect(() => {
    ipcRenderer.on('clean-install-error', (error: any) => {
      setCleanInstallError(error);
    });
    return () => {
      ipcRenderer.removeAllListeners('clean-install-error');
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
    console.log('file', file);
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
    fontSize: '1.2rem',
    textAlign: 'center',
  };

  return (
    <>
      <Box sx={pageContainerStyles}>
        <Box sx={pageContentStyles} justifyContent={'space-between'}>
          <Box>
            <Slideshow moddedInstall={moddedInstall} />
            <Typography sx={loadingMessageStyles}>{loadingMessage}</Typography>
          </Box>
          <Box>
            <Typography variant="h1" sx={percentDoneStyles}>
              {downloadPercentCompleted.toFixed(1) || 0}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={downloadPercentCompleted ?? 0}
            ></LinearProgress>
            <Typography>{downloadEstimatedTime}</Typography>

            {filesErrored?.length > 0 && (
              <Box>
                <Typography variant="h4" color="error">
                  There was a problem installing these files:
                </Typography>

                {filesErrored.map((file: any) => (
                  <Typography color="secondary">{file}</Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={pageFooterStyles}>
          <Button onClick={onBackClick}>Back</Button>
          <Button onClick={onCancelClick} color={'error'}>
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Back Dialog */}
      <ConfirmationDialog
        open={cleanInstallError}
        onCancel={() => {
          cancelInstallAndGoBack();
        }}
        onConfirm={() => {
          setCleanInstallError('');
          startDownloads();
        }}
        promptTitle={
          'There was a problem during the clean install process. Retry?'
        }
        promptDescription={`This could be due to a file being in use by another program. Please close any programs that may be using the files and try again. ${cleanInstallError}`}
      />

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
