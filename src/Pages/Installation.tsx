import { Box, Button, LinearProgress, Typography } from "@mui/material";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import StorageKeys from "Services/StorageKeys";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export default function Installation() {
  const { ipcRenderer } = window.require("electron");
  const router = useNavigate();
  //TODO remove hard-coding
  const [host] = useState(
    "https://storage.googleapis.com/infinity-assets-dev/"
  );
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
            `${host}${mod.source}`,
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
            `${host}${localPrefab.source}`,
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

  // Effects

  useEffect(() => {
    alert("use effect");
    startDownloads();
  }, []);

  useEffect(() => {
    if (downloadProgress >= 100) {
      router(AppRoutes.finished);
    }
  }, [downloadProgress]);

  useEffect(() => {
    ipcRenderer.on("download-complete", (event: any, file: any) => {
      console.log("[download-complete]", file);
      addToCompletedFiles(file);
    });
    ipcRenderer.on("download-error", (event: any, file: any) => {
      console.log("[download-error]", file);
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
    // TODO
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

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Typography>TODO Zombie walking/running animation</Typography>

        <Typography variant="h1" sx={percentDoneStyles}>
          {downloadProgress.toFixed(1) || 0}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={downloadProgress ?? 0}
        ></LinearProgress>
        {/* {downloadProgress >= 100 && (
          <Typography variant="h3" color="success">
            Done! 😎
          </Typography>
        )} */}
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button onClick={onCancelClick}>Cancel</Button>
        {/* <Button onClick={startDownloads} variant="contained">
          Download
        </Button> */}
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
