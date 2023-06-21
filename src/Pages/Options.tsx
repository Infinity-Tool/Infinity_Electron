import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  TextField,
} from "@mui/material";
import { formContainer as formContainerStyles } from "Services/CommonStyles";
import { routes } from "Services/Constants";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Options() {
  const router = useNavigate();
  const [cleanInstall, setCleanInstall] = useLocalStorage(
    "cleanInstall",
    false
  );
  const [localPrefabsPath, setLocalPrefabsPath] = useLocalStorage(
    "localPrefabsPath",
    ""
  );
  const [modsPath, setModsPath] = useLocalStorage("modsPath", "");
  const [localPrefabsError, setLocalPrefabsError] = useState(false);
  const [localModsError, setLocalModsError] = useState(false);

  enum FolderType {
    mods = "mods",
    localPrefabs = "localPrefabs",
  }

  //File selection
  const { ipcRenderer } = window.require("electron");

  const handleSelectFolder = (folderType: FolderType) => {
    ipcRenderer.send("open-folder-dialog", folderType);
  };

  useEffect(() => {
    ipcRenderer.on("selected-directory", (event: any, path, folderType) => {
      // Handle selected directory path
      if (!event.canceled) {
        const filePath = path.filePaths[0];
        switch (folderType) {
          case FolderType.mods:
            setModsPath(filePath);
            break;
          case FolderType.localPrefabs:
            setLocalPrefabsPath(filePath);
            break;
          default:
            console.error("Unknown folder type", folderType);
        }
      } else {
        console.log("No directory selected.");
      }
    });

    return () => {
      ipcRenderer.removeAllListeners("selected-directory");
    };
  }, [ipcRenderer]);

  //Functions
  const onBackClick = () => {
    router(routes.welcome);
  };

  const onNextClick = () => {
    if (Validate()) {
      SaveSettings();
      router(routes.selection);
    } else {
      // todo display error message?
    }
  };
  const Validate = (): boolean => {
    let valid = true;
    if (localPrefabsPath === "") {
      valid = false;
      setLocalPrefabsError(true);
    }
    if (modsPath === "") {
      valid = false;
      setLocalModsError(true);
    }
    //todo check paths exists

    return valid;
  };

  const SaveSettings = () => {};

  const onLocalPrefabsPathChange = (event: any) => {
    setLocalPrefabsPath(event.target.value);
    setLocalPrefabsError(false);
  };

  //Styles
  const buttonContainer = {
    display: "flex",
    gap: "1rem",
    justifyContent: "end",
  };
  const checkBoxStyles = {
    "& .MuiSvgIcon-root": { fontSize: "2rem" },
  };

  return (
    <>
      <h1>Setup</h1>

      <Box sx={formContainerStyles}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={cleanInstall}
                onChange={(e) => setCleanInstall(e.target.checked)}
                sx={checkBoxStyles}
              />
            }
            label="Clean Install"
          />

          {cleanInstall === true && (
            <FormHelperText color="text.warning">
              <strong>WARNING</strong> This will wipe all files from your
              LocalPrefabs and Mods folders. We recommend backing up your
              folders.
            </FormHelperText>
          )}
        </FormGroup>

        <FormControl>
          <TextField
            label="LocalPrefabs Folder"
            id="localPrefabs-folder-path"
            value={localPrefabsPath}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => handleSelectFolder(FolderType.localPrefabs)}
                >
                  <FontAwesomeIcon icon={faFolder} />
                </IconButton>
              ),
            }}
          />
        </FormControl>

        <FormControl>
          <TextField
            label="Mods Folder"
            id="mods-folder-path"
            value={modsPath}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => handleSelectFolder(FolderType.mods)}>
                  <FontAwesomeIcon icon={faFolder} />
                </IconButton>
              ),
            }}
          />
        </FormControl>

        <Box sx={buttonContainer}>
          <Button onClick={onBackClick}>Back</Button>
          <Button variant="contained" onClick={onNextClick}>
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
}
