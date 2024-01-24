import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { IsOkayPath } from '../Services/Utils/PathValidatorUtils';
import {
  InstallMethod,
  useSelectionContext,
} from '../Services/SelectionContext';

export default function Options() {
  const { ipcRenderer } = window.electron;
  const router = useNavigate();
  const theme = useTheme();
  const {
    installMethod,
    setInstallMethod,
    modsDirectory,
    setModsDirectory,
    moddedInstall,
    setModdedInstall,
    localPrefabsDirectory,
    setLocalPrefabsDirectory,
  } = useSelectionContext();

  const [localPrefabsError, setLocalPrefabsError] = useState(false);
  const [localModsError, setLocalModsError] = useState(false);
  const hasErrors = localPrefabsError || localModsError;

  enum FolderType {
    mods = 'mods',
    localPrefabs = 'localPrefabs',
  }

  // File selection
  const handleSelectFolder = (folderType: FolderType) => {
    ipcRenderer.sendMessage('open-folder-dialog', folderType);
  };
  useEffect(() => {
    return HandleFolderSelected();
  }, [ipcRenderer]);

  const onModsPathChange = (value: string) => {
    setModsDirectory(value);
    setLocalModsError(false);
  };

  const onLocalPrefabsPathChange = (value: string) => {
    setLocalPrefabsDirectory(value);
    setLocalPrefabsError(false);
  };

  //Functions
  const HandleFolderSelected = () => {
    ipcRenderer.on('selected-directory', (event: any, path: any) => {
      const { folderType } = event;
      // console.log(
      //   'selected-directory',
      //   'event',
      //   event,
      //   'path',
      //   path,
      //   'folderType',
      //   folderType,
      // );
      if (!event.canceled && event.filePaths?.length > 0) {
        const filePath = event.filePaths[0];
        switch (folderType) {
          case FolderType.mods:
            onModsPathChange(filePath);
            break;
          case FolderType.localPrefabs:
            onLocalPrefabsPathChange(filePath);
            break;
          default:
            console.error('Unknown folder type', folderType);
        }
      } else {
        console.warn('No directory selected.');
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('selected-directory');
    };
  };

  const onBackClick = () => {
    router(AppRoutes.welcome);
  };

  const onNextClick = () => {
    if (Validate()) {
      if (moddedInstall) router(AppRoutes.citiesAndSettlements);
      else router(AppRoutes.vanillaPois);
    } else {
      // todo throw toast/display error?
    }
  };
  const Validate = (): boolean => {
    let valid = true;
    if (!IsOkayPath(localPrefabsDirectory)) {
      valid = false;
      setLocalPrefabsError(true);
    }
    if (!IsOkayPath(modsDirectory)) {
      valid = false;
      setLocalModsError(true);
    }
    return valid;
  };

  //Styles
  const formControlStyles = {
    width: '100%',
  };
  const checkBoxStyles = {
    '& .MuiSvgIcon-root': { fontSize: '2rem' },
  };
  const formContainerStyles = {
    display: 'flex',
    gap: '2rem',
    flexDirection: 'column',
  };
  const installationTypeContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(4),
    mt: theme.spacing(4),
    mb: theme.spacing(8),
    px: theme.spacing(4),
  };

  const installationTypeStyles = (selected: boolean) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(2),
    border: `2px solid ${
      selected ? theme.palette.primary.main : 'transparent'
    }`,
    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
    transform: selected ? 'scale(1.05)' : 'scale(.95)',
    transition: 'all 0.2s ease-in-out',
    flex: 1,
    cursor: 'pointer',
    textAlign: 'center',
    // filter to mute all color
    filter: selected ? 'none' : 'grayscale(100%)',
  });

  const installationMethodContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    mt: theme.spacing(2),
    mb: theme.spacing(4),
    px: theme.spacing(2),
  };

  const warningStyles = {
    color: theme.palette.warning.main,
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={installationTypeContainerStyles}>
          <Paper
            onClick={() => setModdedInstall(true)}
            sx={installationTypeStyles(moddedInstall)}
          >
            <Typography variant="h5">Modded (Recommended)</Typography>
            <Typography>
              Adds support for custom Towns & Settlements, blah blah blah and
              much more.
            </Typography>
          </Paper>
          <Paper
            onClick={() => setModdedInstall(false)}
            sx={installationTypeStyles(!moddedInstall)}
          >
            <Typography variant="h5">Vanilla</Typography>
            <Typography>Add custom POIs to vanilla towns.</Typography>
          </Paper>
        </Box>

        <Box sx={formContainerStyles}>
          <FormControl>
            <TextField
              label="LocalPrefabs Folder"
              id="localPrefabs-folder-path"
              value={localPrefabsDirectory || ''}
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
              value={modsDirectory || ''}
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

          {moddedInstall && (
            <Box>
              <Typography color="error" variant="h4">
                NOT IMPLEMENTED
              </Typography>
              <FormGroup sx={formControlStyles}>
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={cleanInstall}
                      // onChange={(e) => setCleanInstall(e.target.checked)}
                      sx={checkBoxStyles}
                    />
                  }
                  label="Hide all trader selections (Usually for those who play with overhauls)"
                />
              </FormGroup>
            </Box>
          )}
          <Typography variant="caption" color="error">
            {hasErrors && 'Please provide valid file paths.'}
          </Typography>
        </Box>

        {/* Installation Type */}
        <Typography color="error" variant="h4">
          NOT IMPLEMENTED
        </Typography>
        <Box sx={installationMethodContainerStyles}>
          <Paper
            onClick={() => setInstallMethod(InstallMethod.overwrite)}
            sx={installationTypeStyles(
              installMethod === InstallMethod.overwrite,
            )}
          >
            <Typography variant="h5">Overwrite (Recommended)</Typography>
            <Typography>
              Installs newly-selected files and overwrites existing files. No
              files will be deleted.
            </Typography>
          </Paper>
          <Paper
            onClick={() => setInstallMethod(InstallMethod.missingFilesOnly)}
            sx={installationTypeStyles(
              installMethod === InstallMethod.missingFilesOnly,
            )}
          >
            <Typography variant="h5">Quick Install</Typography>
            <Typography>
              Only download missing files which is a faster installation.
            </Typography>
            <Typography sx={warningStyles} variant="caption">
              WARNING: If newer files are available, they will not be
              downloaded. Only recommended if your last installation was recent.
            </Typography>
          </Paper>
          <Paper
            onClick={() => setInstallMethod(InstallMethod.cleanInstall)}
            sx={installationTypeStyles(
              installMethod === InstallMethod.cleanInstall,
            )}
          >
            <Typography variant="h5">Clean Install</Typography>
            <Typography>
              Wipe out target folders and fully install all files from scratch.
            </Typography>
            <Typography sx={warningStyles} variant="caption">
              WARNING: This will delete the entire contents of the paths
              specified above!
            </Typography>
          </Paper>
        </Box>
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
