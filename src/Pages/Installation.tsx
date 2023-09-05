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
  const router = useNavigate();
  //   const [host] = useLocalStorage(LocalStorageKeys.host, null);
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

  const [filesToDownload, setFilesToDownload] = useState([]);
  const [filesInProgress, setFilesInProgress] = useState([]);
  const [filesCompleted, setFilesCompleted] = useState([]);
  const [filesErrored, setFilesErrored] = useState([]);

  useEffect(() => {
    buildFileLists();
  }, [step1Selection]);

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
          const installationFile = new InstallationFile(
            `${host}${mod.source}`,
            `${modsDirectory}/${mod.destination}`
          );
          modFiles.push(installationFile);
        });

        localPrefabs.forEach((localPrefab: any) => {
          const installationFile = new InstallationFile(
            `${host}${localPrefab.source}`,
            `${localPrefabsDirectory}/${localPrefab.destination}`
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
    // call downloadNextFile
  };

  const downloadNextFile = () => {
    // pull a file out of filesToDownload
    // add it to filesInProgress
    // download it
  };

  const onFileDone = () => {
    // remove from filesInProgress
    // add to filesCompleted
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

        <div>
          <Typography>Files to download 😀</Typography>
          {filesToDownload.map((file: any, index) => (
            <div key={index}>{JSON.stringify(file)}</div>
          ))}
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

  constructor(source: string, destination: string) {
    this.source = source;
    this.destination = destination;
  }
}
