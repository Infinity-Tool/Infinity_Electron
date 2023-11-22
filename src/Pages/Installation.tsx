import {
  Box,
  Button,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import Loading from "Components/Loading";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import { LoadingMessages } from "Services/LoadingMessages";
import StorageKeys from "Services/StorageKeys";
import { useHttpContext } from "Services/http/HttpContext";
import useLocalStorage from "Services/useLocalStorage";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export default function Installation() {
  const { ipcRenderer } = window.require("electron");
  const router = useNavigate();
  const theme = useTheme();
  const { baseUrl } = useHttpContext();
  const [modsDirectory] = useLocalStorage(StorageKeys.modsDirectory, "");
  const [localPrefabsDirectory] = useLocalStorage(
    StorageKeys.localPrefabsDirectory,
    ""
  );
  const [availableStep1Files]: any = useLocalStorage(
    StorageKeys.availableStep1Files,
    []
  );
  const [availableStep2Files]: any = useLocalStorage(
    StorageKeys.availableStep2Files,
    []
  );
  const [fileCount, setFileCount]: any = useState();
  const [step1Selection] = useLocalStorage(StorageKeys.step1Selection, []);
  const [step2Selection] = useLocalStorage(StorageKeys.step2Selection, []);
  const [filesCompleted, setFilesCompleted]: any = useState([]);
  const [filesErrored, setFilesErrored]: any = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");

  const downloadProgress = useMemo(() => {
    const totalFiles = fileCount;
    const completedFiles = filesCompleted.length;
    const erroredFiles = filesErrored.length;
    return ((completedFiles ?? 0 + erroredFiles ?? 0) / totalFiles ?? 0) * 100;
  }, [filesCompleted]);

  const startDownloads = () => {
    const step1Files = buildFileLists(availableStep1Files, step1Selection);
    const step2Files = buildFileLists(availableStep2Files, step2Selection);

    const combinedFileLists = [...step1Files, ...step2Files];

    setFileCount(combinedFileLists.length);

    const filesPreppedForDownload = combinedFileLists.map((file: any) => {
      const directoryWithoutFileName = file.destination.substring(
        0,
        file.destination.lastIndexOf("/")
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

    ipcRenderer.send("queue-files-for-download", filesPreppedForDownload);
  };

  const buildFileLists = (
    availableFiles: any,
    selectedFiles: any
  ): InstallationFile[] => {
    let formattedInstallationFiles: any = [];

    selectedFiles.forEach((selected: any) => {
      const foundEntry = availableFiles.find(
        (available: any) => selected.name === available.name
      );

      if (foundEntry) {
        const mods = foundEntry.mods;
        const localPrefabs = foundEntry.localPrefabs;

        mods.forEach((mod: any) => {
          const fileName = mod.destination.substring(
            mod.destination.lastIndexOf("/") + 1
          );
          const installationFile = new InstallationFile(
            `${baseUrl}/${mod.source}`,
            `${modsDirectory}/${mod.destination}`,
            fileName
          );
          formattedInstallationFiles.push(installationFile);
        });

        localPrefabs.forEach((localPrefab: any) => {
          const fileName = localPrefab.destination.substring(
            localPrefab.destination.lastIndexOf("/") + 1
          );
          const installationFile = new InstallationFile(
            `${baseUrl}/${localPrefab.source}`,
            `${localPrefabsDirectory}/${localPrefab.destination}`,
            fileName
          );
          formattedInstallationFiles.push(installationFile);
        });
      } else {
        // TODO display error?
      }
    });

    return formattedInstallationFiles;
  };

  const updateLoadingMessage = () => {
    if (downloadProgress && downloadProgress < 100) {
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
    if (downloadProgress >= 100) {
      router(AppRoutes.finished);
    }
  }, [downloadProgress]);

  useEffect(() => {
    ipcRenderer.on("download-complete", (event: any, file: any) => {
      addToCompletedFiles(file);
    });
    ipcRenderer.on("download-error", (event: any, file: any) => {
      addToErroredFiles(file);
    });
    return () => {
      ipcRenderer.removeAllListeners("download-complete");
      ipcRenderer.removeAllListeners("download-error");
    };
  }, [ipcRenderer]);

  const onBackClick = (event: any) => {
    router(AppRoutes.citiesAndSettlements);
  };

  const onCancelClick = (event: any) => {
    ipcRenderer.send("cancel-downloads");
  };

  const addToCompletedFiles = (file: string) => {
    setFilesCompleted((prev: any) => [...prev, file]);
  };

  const addToErroredFiles = (file: string) => {
    setFilesErrored((prev: any) => [...prev, file]);
  };

  //Styles
  const percentDoneStyles = {
    width: "100%",
    fontSize: "3rem",
    textAlign: "center",
  };
  const loadingMessageStyles = {
    my: theme.spacing(2),
    width: "100%",
    fontSize: "1.5rem",
    textAlign: "center",
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        {/* <Typography>TODO Zombie walking/running animation</Typography> */}

        <Typography variant="h1" sx={percentDoneStyles}>
          {downloadProgress.toFixed(1) || 0}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={downloadProgress ?? 0}
        ></LinearProgress>

        <Typography sx={loadingMessageStyles}>{loadingMessage}</Typography>
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button onClick={onCancelClick}>Cancel</Button>
      </Box>
    </Box>
  );
}

class InstallationFile {
  source: string;
  destination: string;
  fileName: string;

  constructor(source: string, destination: string, fileName: string) {
    this.source = source;
    this.destination = destination;
    this.fileName = fileName;
  }
}
