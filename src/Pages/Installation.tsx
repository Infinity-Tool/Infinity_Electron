import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { FileType } from "Models/FileType";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import LocalStorageKeys from "Services/LocalStorageKeys";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Installation() {
  const maxInQueue = 1;
  const router = useNavigate();
  const { ipcRenderer } = window.require("electron");
  const [cancelled, setCancelled] = useState(false);
  const [done, setDone] = useState(false);
  const [host] = useLocalStorage(LocalStorageKeys.host, null);
  const [modsDirectory] = useLocalStorage(LocalStorageKeys.modsDirectory, "");
  const [localPrefabsDirectory] = useLocalStorage(
    LocalStorageKeys.localPrefabsDirectory,
    ""
  );

  const [modFiles] = useLocalStorage(LocalStorageKeys.modFiles, []);
  const [localPrefabFiles] = useLocalStorage(
    LocalStorageKeys.localPrefabFiles,
    []
  );

  const [cleanInstall] = useLocalStorage(LocalStorageKeys.cleanInstall, false);
  const [filesToDownload, setFilesToDownload]: any = useState([]);
  const [filesInProgress, setFilesInProgress]: any = useState([]);
  const [filesCompleted, setFilesCompleted]: any = useState([]);
  const [filesErrored, setFilesErrored]: any = useState([]);

  //TODO clean install

  //TODO make on useMount effect
  // useEffect(() => {
  //   const _filesToDownload = modFiles
  //     .map((file: any) => ({
  //       path: file,
  //       type: FileType.Mod,
  //     }))
  //     .concat(
  //       localPrefabFiles.map((file: any) => ({
  //         path: file,
  //         type: FileType.LocalPrefab,
  //       }))
  //     );
  //   setFilesToDownload(_filesToDownload);
  // }, []);

  const testFiles = [
    {
      type: FileType.Mod,
      path: "/files/Test_Settlement_Files/mods/01.mp4",
    },
    {
      type: FileType.Mod,
      path: "/files/Test_Settlement_Files/mods/02.mp4",
    },
    {
      type: FileType.Mod,
      path: "/files/Test_Settlement_Files/mods/03.mp4",
    },
    {
      type: FileType.Mod,
      path: "/files/Test_Settlement_Files/mods/04.mp4",
    },
    {
      type: FileType.Mod,
      path: "/files/Test_Settlement_Files/mods/05.mp4",
    },
  ];

  useEffect(() => {
    setFilesToDownload(testFiles);
  }, []);

  //1. Create a useEffect that watches for the ipcRenderer to send a "download complete" event
  //2. When the event is received, add the file to the filesCompleted array and remove from in progress
  //3. Remove file from queue and add to inProgress
  //4. When the queue is empty and inProgress is empty, set done to true

  function QueueNextFile() {
    console.log("QueueNextFile", filesToDownload.length);
    if (filesToDownload.length === 0 || done) {
      return;
    }

    const file = filesToDownload[0];

    const destinationDirectory =
      (file.type === FileType.Mod ? modsDirectory : localPrefabsDirectory) +
      file.path;

    // setFilesInProgress((_inProgress: any) => [..._inProgress, file]);
    setFilesToDownload((_filesToDownload: any) =>
      _filesToDownload.filter((f: any) => f !== file)
    );

    const directoryWithoutFileName = destinationDirectory.substring(
      0,
      destinationDirectory.lastIndexOf("/")
    );

    ipcRenderer.send("download-file", {
      url: `${host}/${file.path}`,
      // url: file.path,
      properties: {
        directory: directoryWithoutFileName,
        fileName: file.path,
        overwrite: true,
      },
    });
  }

  //Functions
  const onCancelClick = () => {
    setFilesToDownload([]);
    setCancelled(true);
    setDone(false);
  };
  const onBackClick = () => {
    router(AppRoutes.selection);
    setDone(false);
  };

  const onStartOverClick = () => {
    router(AppRoutes.welcome);
    setDone(false);
  };

  //Effects
  useEffect(() => {
    ipcRenderer.on("download-complete", (event: any, file: any) => {
      console.log("download-complete", file);
      setFilesCompleted((_filesCompleted: any) => [..._filesCompleted, file]);
      RemoveFromProgressAndQueueNext(file);
    });

    // ipcRenderer.on("download-progress", (status: any) => {
    //   console.log("download-progress", status);
    // });

    ipcRenderer.on("download-error", (event: any, file: any) => {
      setFilesErrored([...filesErrored, file]);
      RemoveFromProgressAndQueueNext(file);
    });

    return () => {
      ipcRenderer.removeAllListeners("download-complete");
      ipcRenderer.removeAllListeners("download-error");
    };
  }, [ipcRenderer, filesToDownload]);

  function RemoveFromProgressAndQueueNext(file: string) {
    setFilesInProgress((_filesInProgress: any) =>
      _filesInProgress.filter((f: any) => f !== file)
    );

    if (filesToDownload.length > 0) {
      setTimeout(() => {
        QueueNextFile();
      }, 500);
    } else {
      setDone(true);
    }
  }

  //Styles
  const fileBoxContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };
  const fileBoxStyles = {
    p: "1rem",
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={fileBoxContainerStyles}>
          <Paper sx={fileBoxStyles}>
            <Typography>Queued:</Typography>
            {filesToDownload.map((file: any) => (
              <Typography>{file.path}</Typography>
            ))}
          </Paper>

          <Paper sx={fileBoxStyles}>
            <Typography>In Progress:</Typography>
            {filesInProgress.map((file: any) => (
              <Typography>{file}</Typography>
            ))}
          </Paper>

          <Paper sx={fileBoxStyles}>
            <Typography>Completed:</Typography>
            {filesCompleted.map((file: any) => (
              <Typography>{file}</Typography>
            ))}
          </Paper>

          <Paper sx={fileBoxStyles}>
            <Typography>Errored:</Typography>
            {filesErrored.map((file: any) => (
              <Typography>{file}</Typography>
            ))}
          </Paper>
        </Box>

        {done && <Typography>Done!</Typography>}

        <Button onClick={QueueNextFile}>Begin Install</Button>

        {cancelled && (
          <Box>
            <Typography>Download canceled! ☹️</Typography>
            <Button onClick={onStartOverClick}>Start over</Button>
          </Box>
        )}
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button onClick={onCancelClick}>Cancel</Button>
      </Box>
    </Box>
  );
}
