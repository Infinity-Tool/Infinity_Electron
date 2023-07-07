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
  Typography,
} from "@mui/material";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IsOkayPath } from "Services/Utils/PathValidatorUtils";
import LocalStorageKeys from "Services/LocalStorageKeys";

export default function Options() {
  const { ipcRenderer } = window.require("electron");
  const router = useNavigate();
  const [cleanInstall, setCleanInstall] = useLocalStorage(
    LocalStorageKeys.cleanInstall,
    false
  );
  const [localPrefabsPath, setLocalPrefabsPath] = useLocalStorage(
    "localPrefabsPath",
    ""
  );
  const [modsPath, setModsPath] = useLocalStorage("modsPath", "");
  const [localPrefabsError, setLocalPrefabsError] = useState(false);
  const [localModsError, setLocalModsError] = useState(false);
  const hasErrors = localPrefabsError || localModsError;

  console.log("modsPath", modsPath);

  enum FolderType {
    mods = "mods",
    localPrefabs = "localPrefabs",
  }

  //File selection
  const handleSelectFolder = (folderType: FolderType) => {
    ipcRenderer.send("open-folder-dialog", folderType);
  };
  useEffect(() => {
    return HandleFolderSelected();
  }, [ipcRenderer]);

  //Functions
  const HandleFolderSelected = () => {
    ipcRenderer.on("selected-directory", (event: any, path, folderType) => {
      if (!event.canceled && path?.filePaths.length > 0) {
        const filePath = path.filePaths[0];
        switch (folderType) {
          case FolderType.mods:
            onModsPathChange(filePath);
            break;
          case FolderType.localPrefabs:
            onLocalPrefabsPathChange(filePath);
            break;
          default:
            console.error("Unknown folder type", folderType);
        }
      } else {
        console.warn("No directory selected.");
      }
    });

    return () => {
      ipcRenderer.removeAllListeners("selected-directory");
    };
  };

  const onBackClick = () => {
    router(AppRoutes.welcome);
  };

  const onNextClick = () => {
    if (Validate()) {
      SaveSettings();
      router(AppRoutes.selection);
    } else {
      // todo display error message?
    }
  };
  const Validate = (): boolean => {
    let valid = true;
    if (!IsOkayPath(localPrefabsPath)) {
      valid = false;
      setLocalPrefabsError(true);
    }
    if (!IsOkayPath(modsPath)) {
      valid = false;
      setLocalModsError(true);
    }
    return valid;
  };

  const SaveSettings = () => {};

  const onLocalPrefabsPathChange = (value: string) => {
    setLocalPrefabsPath(value);
    setLocalPrefabsError(false);
  };

  const onModsPathChange = (value: string) => {
    setModsPath(value);
    setLocalModsError(false);
  };

  //Styles
  const formControlStyles = {
    width: "100%",
  };
  const checkBoxStyles = {
    "& .MuiSvgIcon-root": { fontSize: "2rem" },
  };
  const warningTextStyles = {
    color: "warning.main",
    opacity: cleanInstall ? 1 : 0,
    cursor: cleanInstall ? "text" : "default",
  };
  const formContainerStyles = {
    display: "flex",
    gap: "2rem",
    flexDirection: "column",
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={formContainerStyles}>
          <FormGroup sx={formControlStyles}>
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

            <FormHelperText sx={warningTextStyles}>
              <strong>WARNING</strong> This will wipe all files from your
              selected folders. We recommend backing up your folders.
            </FormHelperText>
          </FormGroup>

          <FormControl>
            <TextField
              label="LocalPrefabs Folder"
              id="localPrefabs-folder-path"
              value={localPrefabsPath || ""}
              onChange={(event) => onLocalPrefabsPathChange(event.target.value)}
              error={localPrefabsError}
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
              value={modsPath || ""}
              error={localModsError}
              onChange={(event) => onModsPathChange(event.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => handleSelectFolder(FolderType.mods)}
                  >
                    <FontAwesomeIcon icon={faFolder} />
                  </IconButton>
                ),
              }}
            />
          </FormControl>
        </Box>
        <Typography variant="caption" color="error">
          {hasErrors && "Please provide valid file paths."}
        </Typography>
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button variant="contained" onClick={onNextClick}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
