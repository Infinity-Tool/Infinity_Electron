import { Box, Button, Typography } from "@mui/material";
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
  const [step1Selection] = useLocalStorage(LocalStorageKeys.step1Selection, []);

  const [filesToDownload, setFilesToDownload]: any = useState([]);
  const [filesInProgress, setFilesInProgress]: any = useState([]);
  const [filesCompleted, setFilesCompleted]: any = useState([]);
  const [filesErrored, setFilesErrored]: any = useState([]);
  const [done, setDone]: any = useState(false);

  useEffect(() => {
    buildFileLists();
  }, [step1Selection]);

  useEffect(() => {
    ipcRenderer.on("download-complete", (event: any, file: any) => {
      onFileDone(event, file);
    });

    ipcRenderer.on("download-error", (event: any, file: any) => {
      onFileError(event, file);
    });
  }, [ipcRenderer]);

  //Functions
  const buildFileLists = () => {
    let modFiles: any = [];

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
          modFiles.push(installationFile);
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
          modFiles.push(installationFile);
        });
      }
    });

    setFilesToDownload(modFiles);
  };

  const onBackClick = (event: any) => {
    router(AppRoutes.citiesAndSettlements);
  };

  const onDownloadClick = () => {
    downloadNextFile();
  };

  const downloadNextFile = () => {
    const nextFile: any =
      filesToDownload.length > 0 ? filesToDownload[0] : null;
    if (nextFile) {
      // add it to filesInProgress
      setFilesInProgress([...filesInProgress, nextFile]);
      setFilesToDownload(filesToDownload.slice(1));
      // remove from filesToDownload

      const directoryWithoutFileName = nextFile.destination.substring(
        0,
        nextFile.destination.lastIndexOf("/")
      );

      ipcRenderer.send("download-file", {
        url: nextFile.source,
        // url: file.path,
        properties: {
          directory: directoryWithoutFileName,
          fileName: nextFile.fileName,
          overwrite: true,
        },
      });
      // download it
    } else {
      setDone(true);
    }
  };

  const onFileDone = (event: any, file: any) => {
    console.log("onFileDone", event, file);

    setFilesInProgress(filesInProgress.filter((f: any) => f.fileName !== file));
    const newFilesCompeleted = [...filesCompleted, file];
    setFilesCompleted(newFilesCompeleted);
    // downloadNextFile();
  };

  const onFileError = (event: any, file: any) => {
    console.error("onFileError", event, file);
    // remove from filesInProgress
    // add to filesErrored
    // call downloadNextFile
  };

  //Styles
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

        {done && <Typography color="success">Done</Typography>}
        <div>
          <Typography>Files to download</Typography>
          {filesToDownload.length}
        </div>
        <br />
        <div>
          <Typography>Files in progress</Typography>
          {filesInProgress.length}
        </div>
        <br />
        <div>
          <Typography>Files errored</Typography>
          {filesErrored.length}
        </div>
        <br />

        <div>
          <Typography>Files complete</Typography>
          {filesCompleted.length}
        </div>
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
