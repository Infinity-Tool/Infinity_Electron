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
import { AppRoutes, TRADER_TAG } from '../Services/Constants';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import {
  InstallMethod,
  useSelectionContext,
} from '../Services/SelectionContext';
import { InstallationFile } from '../Models/InstallationFile';
import { InstallationRequest } from '../Models/InstallationRequest';
import Slideshow from '../Components/Slideshow';
import useLocalStorage from '../Services/useLocalStorage';
import StorageKeys from '../Services/StorageKeys';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';
import LoadingMessages from '../Components/LoadingMessages';
import LocalizationFile from '../Models/LocalizationFile';
import RWGMixerFile from '../Models/RWGMixerFile';

export default function Installation() {
  const router = useNavigate();
  const theme = useTheme();
  const { ipcRenderer } = window.electron;
  const { baseUrl } = useHttpContext();
  const [lastInstallDate, setLastInstallDate] = useLocalStorage(
    StorageKeys.lastInstallDate,
    null,
  );
  const directoryQuery = GetDirectoryFileQuery();
  const availableStep0FilesModded = directoryQuery.data?.step_0_modded;
  const availableStep0FilesUnmodded = directoryQuery.data?.step_0_unmodded;
  const availableStep1Files = directoryQuery.data?.step_1;
  const availableStep2Files = directoryQuery.data?.step_2;
  const availableStep3Files = directoryQuery.data?.step_3;
  const availableStep4Files = directoryQuery.data?.step_4;
  const availableStep5Files = directoryQuery.data?.step_5;
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
    step5Selection,
    excludeTraders,
    buildTeragonFiles,
  } = useSelectionContext();
  const [filesCompleted, setFilesCompleted]: any = useState([]);
  const [filesErrored, setFilesErrored]: any = useState([]);
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
    if (downloadPercentCompleted === 100) {
      return 'Wrapping up a few more things...';
    }
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

  const buildFileLists = (
    availableFiles: any,
    selectedFiles: any,
  ): {
    installationFiles: InstallationFile[];
    localizationFiles: LocalizationFile[];
    rwgMixerFiles: RWGMixerFile[];
    poiPropertyList: string;
    townPropertyList: string;
  } => {
    const formattedInstallationFiles: any = [];
    const localizationFiles: LocalizationFile[] = [];
    const rwgMixerFiles: RWGMixerFile[] = [];
    let poiPropertyList = '';
    let townPropertyList = '';

    selectedFiles.forEach((selected: any) => {
      const foundEntry = availableFiles.find(
        (available: any) => selected.name === available.name,
      );

      if (foundEntry) {
        const { mods, localPrefabs } = foundEntry;

        FormatAndAddModFiles(mods, formattedInstallationFiles);
        FormatAndAddLocalPrefabFiles(localPrefabs, formattedInstallationFiles);

        if (foundEntry.townPropertyList) {
          townPropertyList += foundEntry.townPropertyList + '\n';
        }
        if (foundEntry.poiPropertyList) {
          poiPropertyList += foundEntry.poiPropertyList;
        }

        if (selected.childSelections.length > 0) {
          selected.childSelections.forEach((child: any) => {
            const foundChildEntry = foundEntry.childSelections.find(
              (availableChild: any) => {
                if (
                  excludeTraders &&
                  availableChild?.editorGroups?.includes(
                    TRADER_TAG(moddedInstall),
                  )
                ) {
                  return false;
                }

                return child === availableChild.name;
              },
            );

            if (foundChildEntry) {
              const mods = foundChildEntry.mods ?? [];
              const {
                localPrefabs,
                localizationSource,
                localizationDestination,
                rwgMixerSource,
                rwgMixerDestination,
              } = foundChildEntry;

              if (foundChildEntry.townPropertyList) {
                townPropertyList += foundChildEntry.townPropertyList + '\n';
              }
              if (foundChildEntry.poiPropertyList) {
                poiPropertyList += foundChildEntry.poiPropertyList + '\n';
              }
              if (localizationSource && localizationDestination) {
                const localizationFile = new LocalizationFile(
                  localizationSource,
                );
                localizationFiles.push(localizationFile);
              }
              if (rwgMixerSource && rwgMixerDestination) {
                const rwgMixerFile = new RWGMixerFile(
                  `${baseUrl}/${rwgMixerSource}`,
                  `${modsDirectory}/${rwgMixerDestination}`,
                );
                rwgMixerFiles.push(rwgMixerFile);
              }

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

    return {
      installationFiles: formattedInstallationFiles,
      localizationFiles,
      rwgMixerFiles,
      poiPropertyList,
      townPropertyList,
    };
  };

  const startDownloads = () => {
    const utcNow = Date.now();
    setLastInstallDate(utcNow);
    setStartTime(utcNow);
    let allFiles = [];
    let localizationFiles: LocalizationFile[] = [];
    let rwgMixerFiles: RWGMixerFile[] = [];
    let townPropertyList = '';
    let poiPropertyList = '';

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
        ...step0FilesModded.installationFiles,
        ...step1Files.installationFiles,
        ...step2Files.installationFiles,
        ...step3Files.installationFiles,
      ];
      localizationFiles = [
        ...step0FilesModded.localizationFiles,
        ...step1Files.localizationFiles,
        ...step2Files.localizationFiles,
        ...step3Files.localizationFiles,
      ];
      rwgMixerFiles = [
        ...step0FilesModded.rwgMixerFiles,
        ...step1Files.rwgMixerFiles,
        ...step2Files.rwgMixerFiles,
        ...step3Files.rwgMixerFiles,
      ];
      townPropertyList =
        step0FilesModded.townPropertyList +
        step1Files.townPropertyList +
        step2Files.townPropertyList +
        step3Files.townPropertyList;
      poiPropertyList =
        step0FilesModded.poiPropertyList +
        step1Files.poiPropertyList +
        step2Files.poiPropertyList +
        step3Files.poiPropertyList;
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
      const step5Files = buildFileLists(availableStep5Files, step5Selection);
      allFiles = [
        ...step0FilesUnModded.installationFiles,
        ...step4Files.installationFiles,
        ...step5Files.installationFiles,
      ];
      localizationFiles = [
        ...step0FilesUnModded.localizationFiles,
        ...step4Files.localizationFiles,
        ...step5Files.localizationFiles,
      ];
      rwgMixerFiles = [
        ...step0FilesUnModded.rwgMixerFiles,
        ...step4Files.rwgMixerFiles,
        ...step5Files.rwgMixerFiles,
      ];
      townPropertyList =
        step0FilesUnModded.townPropertyList +
        step4Files.townPropertyList +
        step5Files.townPropertyList;
      poiPropertyList =
        step0FilesUnModded.poiPropertyList +
        step4Files.poiPropertyList +
        step5Files.poiPropertyList;
    }
    setFileCount(
      allFiles.length + localizationFiles.length + rwgMixerFiles.length,
    );

    if (modsDirectory == null || localPrefabsDirectory == null) {
      alert('Error: Mods and local prefabs directories are not set.');
      return;
    }

    const request: InstallationRequest = {
      baseUrl,
      modsDirectory,
      localPrefabsDirectory,
      files: allFiles.reverse(),
      installMethod,
      localizationFiles,
      rwgMixerFiles,
      teragon: buildTeragonFiles
        ? {
            townPropertyList,
            poiPropertyList,
          }
        : null,
    };

    ipcRenderer.sendMessage('queue-files-for-download', request);
  };

  // Effects
  useEffect(() => {
    if (directoryQuery.isSuccess && !downloadsStarted) {
      setDownloadsStarted(true);
      startDownloads();
    }
  }, [directoryQuery]);

  useEffect(() => {
    ipcRenderer.on('download-complete', (file: any) => {
      addToCompletedFiles(file);
    });
    ipcRenderer.on('download-error', (file: any) => {
      addToErroredFiles(file);
    });
    ipcRenderer.on('install-complete', () => {
      navigateFinished();
    });
    return () => {
      ipcRenderer.removeAllListeners('download-complete');
      ipcRenderer.removeAllListeners('download-error');
      ipcRenderer.removeAllListeners('install-complete');
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

  const onChangeSelectionClick = (event: any) => {
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
  const progressContainerStyles = {
    mt: 'auto',
  };

  return (
    <>
      <PageContainer>
        <PageContent justifyContent={'space-between'}>
          <Box>
            <Slideshow moddedInstall={moddedInstall} />
            <LoadingMessages />
          </Box>
          <Box sx={progressContainerStyles}>
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
        </PageContent>

        <PageFooter>
          <Button onClick={onChangeSelectionClick}>Change Selection</Button>
          <Button onClick={onCancelClick} color={'error'}>
            Cancel
          </Button>
        </PageFooter>
      </PageContainer>

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
}
