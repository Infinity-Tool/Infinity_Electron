import { Box, Button, LinearProgress, Typography } from "@mui/material";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import LocalStorageKeys from "Services/LocalStorageKeys";
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
  const [modsDirectory] = useLocalStorage(LocalStorageKeys.modsDirectory, "");
  const [localPrefabsDirectory] = useLocalStorage(
    LocalStorageKeys.localPrefabsDirectory,
    ""
  );
  const [availableFiles]: any = useLocalStorage(
    LocalStorageKeys.availableFiles,
    []
  );
  const [fileCount, setFileCount]: any = useState();
  const [step1Selection] = useLocalStorage(LocalStorageKeys.step1Selection, []);
  const [filesCompleted, setFilesCompleted]: any = useState([]);
  const [filesErrored, setFilesErrored]: any = useState([]);
  const [done, setDone]: any = useState(false);

  const downloadProgress = useMemo(() => {
    const totalFiles = fileCount;
    const completedFiles = filesCompleted.length;
    const erroredFiles = filesErrored.length;

    return ((completedFiles ?? 0 + erroredFiles ?? 0) / totalFiles ?? 0) * 100;
  }, [filesCompleted]);

  const onDownloadClick = () => {
    const files = buildFileLists();

    setFileCount(files.length);

    const filesPreppedForDownload = files.map((file: any) => {
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
        },
      };
    });

    ipcRenderer.send("queue-files-for-download", filesPreppedForDownload);
  };

  const buildFileLists = (): InstallationFile[] => {
    let formattedInstallationFiles: any = [];

    step1Selection.forEach((selected: any) => {
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
      }
    });

    return formattedInstallationFiles;
  };

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

  // useEffect(() => {
  //   buildFileLists();
  // }, [step1Selection]);

  // useEffect(() => {
  //   ipcRenderer.on("download-complete", (event: any, file: any) => {
  //     console.log("[download-complete]", file);
  //     onFileDone(event, file);
  //   });

  //   ipcRenderer.on("download-error", (event: any, file: any) => {
  //     console.log("[download-error]", file);
  //     onFileError(event, file);
  //   });

  //   return () => {
  //     ipcRenderer.removeAllListeners("download-complete");
  //     ipcRenderer.removeAllListeners("download-error");
  //   };
  // }, [ipcRenderer]);

  // useEffect(() => {
  //   downloadNextFile();
  // }, [filesInQueue]);

  // const downloadNextFile = () => {
  //   if (filesInQueue.length > 0) {
  //     const nextFile = getOneFromQueue();
  //     if (nextFile) {
  //       addToInProgressFiles(nextFile);
  //       // removeFromFilesToDownload(nextFile);
  //       const directoryWithoutFileName = nextFile.destination.substring(
  //         0,
  //         nextFile.destination.lastIndexOf("/")
  //       );
  //       // console.log("[downloadNextFile]", nextFile.fileName);
  //       ipcRenderer.send("download-file", {
  //         url: nextFile.source,
  //         properties: {
  //           directory: directoryWithoutFileName,
  //           fileName: nextFile.fileName,
  //           overwrite: true,
  //         },
  //       });
  //     } else {
  //       setDone(true);
  //     }
  //   }
  // };

  // //Functions
  // const buildFileLists = () => {
  //   let modFiles: any = [];

  //   step1Selection.forEach((selected: any) => {
  //     const foundEntry = availableFiles.find(
  //       (available: any) => selected.name === available.name
  //     );

  //     if (foundEntry) {
  //       const mods = foundEntry.mods;
  //       const localPrefabs = foundEntry.localPrefabs;

  //       mods.forEach((mod: any) => {
  //         const fileName = mod.destination.substring(
  //           mod.destination.lastIndexOf("/") + 1
  //         );
  //         const installationFile = new InstallationFile(
  //           `${host}${mod.source}`,
  //           `${modsDirectory}/${mod.destination}`,
  //           fileName
  //         );
  //         modFiles.push(installationFile);
  //       });

  //       localPrefabs.forEach((localPrefab: any) => {
  //         const fileName = localPrefab.destination.substring(
  //           localPrefab.destination.lastIndexOf("/") + 1
  //         );
  //         const installationFile = new InstallationFile(
  //           `${host}${localPrefab.source}`,
  //           `${localPrefabsDirectory}/${localPrefab.destination}`,
  //           fileName
  //         );
  //         modFiles.push(installationFile);
  //       });
  //     }
  //   });

  //   setFilesToDownload(modFiles);
  //   setFullFileList(modFiles);
  // };

  const onBackClick = (event: any) => {
    router(AppRoutes.citiesAndSettlements);
  };

  // const onDownloadClick = () => {
  //   // downloadNextFile();
  //   queueNextFile();
  // };

  // const onFileDone = (event: any, file: any) => {
  //   console.log("onFileDone", event, file);
  //   removeFromInProgressFiles(file);
  //   addToCompletedFiles(file);
  //   queueNextFile();
  // };

  // const onFileError = (event: any, file: any) => {
  //   console.error("onFileError", event, file);
  //   removeFromInProgressFiles(file);
  //   addToErroredFiles(file);
  //   queueNextFile();
  // };

  // const queueNextFile = () => {
  //   const nextFile: any =
  //     filesToDownload.length > 0 ? filesToDownload[0] : null;

  //   if (nextFile) {
  //     // removeFromFilesToDownload(nextFile);
  //     setFilesToDownload((prev: any) =>
  //       prev.filter((f: any) => f.destination !== nextFile.destination)
  //     );
  //     addToQueue(nextFile);
  //   } else {
  //     console.warn("Next file not found");
  //   }
  // };

  // const addToQueue = (file: any) => {
  //   setFilesInQueue((prev: any) => [...prev, file]);
  // };

  // const removeFromQueue = (file: any) => {
  //   setFilesInQueue((prev: any) =>
  //     prev.filter((f: any) => f.destination !== file.destination)
  //   );
  // };

  // const getOneFromQueue = () => {
  //   const file = filesInQueue[0];
  //   removeFromQueue(file);
  //   return file;
  // };

  // const addToInProgressFiles = (file: any) => {
  //   setFilesInProgress((prev: any) => [...prev, file.fileName]);
  // };

  // const removeFromInProgressFiles = (file: any) => {
  //   setFilesInProgress((prev: any) => prev.filter((f: any) => f !== file));
  // };

  // const removeFromFilesToDownload = (file: any) => {
  //   setFilesToDownload((prev: any) => prev.filter((f: any) => f !== file));
  // };

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
      {/* <Button onClick={ConfigureSelectedFiles}>Test (delete me)</Button> */}
      <Box sx={pageContentStyles}>
        {/* <div>
          <Typography>Available Files:</Typography>
          {availableFiles.map((file: any, index: number) => (
            <div>{JSON.stringify(file)}</div>
          ))}
        </div>
        <br />
        <br />

        <div>
          <Typography>User Selection:</Typography>
          {step1Selection.map((selection: any, index: number) => (
            <div>
              Name: {selection.name}, Children:{" "}
              {selection.childSelections.length}
            </div>
          ))}
        </div>
        <br />
        <br />
        <br /> */}
        <Typography variant="h1" sx={percentDoneStyles}>
          {downloadProgress.toFixed(1)}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={downloadProgress ?? 0}
        ></LinearProgress>
        {downloadProgress >= 1 && <Typography color="success">Done</Typography>}

        <div>
          <Typography>Files complete</Typography>
          {filesCompleted?.length}
          {JSON.stringify(filesCompleted)}
        </div>
        <br />
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button onClick={onDownloadClick} variant="contained">
          Download
        </Button>
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
