import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../Services/Constants';
import { IsOkayPath } from '../Services/utils/PathValidatorUtils';
import { useSelectionContext } from '../Services/SelectionContext';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import { useHttpContext } from '../Services/http/HttpContext';
import Loading from '../Components/Loading';
import { enqueueSnackbar } from 'notistack';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';

export default function Options() {
  const { ipcRenderer } = window.electron;
  const { baseUrl } = useHttpContext();
  const router = useNavigate();
  const theme = useTheme();
  const {
    modsDirectory,
    setModsDirectory,
    moddedInstall,
    setModdedInstall,
    localPrefabsDirectory,
    setLocalPrefabsDirectory,
    setStep1Selection,
    setStep2Selection,
    setStep3Selection,
    setStep4Selection,
    excludeTraders,
    setExcludeTraders,
  } = useSelectionContext();

  const [localPrefabsError, setLocalPrefabsError] = useState(false);
  const [localModsError, setLocalModsError] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const hasErrors = localPrefabsError || localModsError;
  const directoryQuery = GetDirectoryFileQuery();
  const showcaseModded = directoryQuery?.data?.showcase_modded;
  const showcaseUnmodded = directoryQuery?.data?.showcase_unmodded;

  enum FolderType {
    mods = 'Mods',
    localPrefabs = 'LocalPrefabs',
  }

  // File selection
  const handleSelectFolder = (folderType: FolderType) => {
    ipcRenderer.sendMessage('open-folder-dialog', folderType);
  };

  useEffect(() => {
    ipcRenderer.on('selected-directory', (event: any) => {
      const { folderType } = event;

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

    ipcRenderer.on('selection-file-selected', (selection: any) => {
      const validSelection = IsValidSelection(selection);

      if (validSelection) {
        try {
          const parsed = JSON.parse(selection);
          setModdedInstall(parsed.moddedInstall);
          setExcludeTraders(parsed.excludeTraders);
          if (parsed.moddedInstall) {
            setStep1Selection(parsed.step1Selection);
            setStep2Selection(parsed.step2Selection);
            setStep3Selection(parsed.step3Selection);
          } else {
            setStep4Selection(parsed.step4Selection);
          }
          enqueueSnackbar('Selection Imported', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            autoHideDuration: 3000,
          });
          router(AppRoutes.preInstallation);
        } catch (e) {
          alert('Error parsing selection file.');
        }
      } else {
        alert('Error: Selection File is not valid.');
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('selected-directory');
      ipcRenderer.removeAllListeners('selection-file-selected');
    };
  }, [ipcRenderer]);

  const IsValidSelection = (selection: any) => {
    if (selection == null) return false;

    //if does not parse to json, it is not a valid selection
    try {
      const parsed = JSON.parse(selection);
      if (parsed.moddedInstall == null) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  };

  const onModsPathChange = (value: string) => {
    setModsDirectory(value);
    setLocalModsError(false);
  };

  const onLocalPrefabsPathChange = (value: string) => {
    setLocalPrefabsDirectory(value);
    setLocalPrefabsError(false);
  };

  const onBackClick = () => {
    router(AppRoutes.agreement);
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

  const onImportClick = () => {
    if (Validate()) {
      ipcRenderer.sendMessage('open-json-file');
    }
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
  const installationTypeStyles = (modded: boolean, selected: boolean): any => ({
    border: `2px solid ${
      selected ? theme.palette.primary.main : 'transparent'
    }`,
    transform: selected ? 'scale(1.04)' : 'scale(.96)',
    transition: 'all 0.2s ease-in-out',
    flex: 1,
    cursor: 'pointer',
    filter: selected ? 'none' : 'grayscale(100%)',
  });
  const helpButtonStyles = {
    mb: theme.spacing(1),
  };

  return (
    <PageContainer>
      <PageContent>
        <Typography variant="h1">Options</Typography>
        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isSuccess && (
          <Box>
            <Box sx={installationTypeContainerStyles}>
              {/* MODDED */}
              <Card
                onClick={() => setModdedInstall(true)}
                sx={installationTypeStyles(true, moddedInstall)}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`${baseUrl}/Showcase_Modded/${showcaseModded[0]}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Modded (Recommended)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Adds support for custom textures, towns & settlements, and
                      some optional mods, allowing for even more POI choices.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

              {/* UNMODDED */}
              <Card
                onClick={() => setModdedInstall(false)}
                sx={installationTypeStyles(false, !moddedInstall)}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`${baseUrl}/Showcase_Unmodded/${showcaseUnmodded[0]}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Vanilla
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add custom POIs to vanilla towns.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>

            <Box>
              <Button
                sx={helpButtonStyles}
                onClick={() => setHelpDialogOpen(true)}
              >
                Help
              </Button>
              <Dialog
                open={helpDialogOpen}
                onClose={() => setHelpDialogOpen(false)}
              >
                <DialogTitle>Help</DialogTitle>
                <DialogContent>
                  <Typography>
                    <strong>Windows</strong>
                  </Typography>
                  <Typography>
                    C:\Users\(your user)\AppData\Roaming\7DaysToDie
                  </Typography>
                  <Typography variant="caption">
                    You can get here by typing <strong>%appdata%</strong> in the
                    address bar of your file explorer.
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    If these folders do not exist then you may need to create
                    them.
                  </Typography>
                </DialogContent>
              </Dialog>
            </Box>
            <Box sx={formContainerStyles}>
              <FormControl>
                <TextField
                  label="LocalPrefabs Folder"
                  id="localPrefabs-folder-path"
                  value={localPrefabsDirectory || ''}
                  onChange={(event) =>
                    onLocalPrefabsPathChange(event.target.value)
                  }
                  error={localPrefabsError}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          handleSelectFolder(FolderType.localPrefabs)
                        }
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

              <Box>
                <FormGroup sx={formControlStyles}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={excludeTraders}
                        onChange={() => setExcludeTraders(!excludeTraders)}
                        sx={checkBoxStyles}
                      />
                    }
                    label="Hide all trader selections"
                  />
                </FormGroup>
                <FormHelperText>
                  Usually for those who play with overhauls
                </FormHelperText>
              </Box>
              <Typography variant="caption" color="error">
                {hasErrors && 'Please provide valid file paths.'}
              </Typography>
            </Box>
          </Box>
        )}
      </PageContent>
      <PageFooter>
        <Tooltip title="Import a selection file and skip to the installation. Usually given to you by someone else, or saved from a previous selection.">
          <Button onClick={onImportClick} sx={{ mr: 'auto' }}>
            Import
          </Button>
        </Tooltip>

        <Button onClick={onBackClick}>Back</Button>
        <Button variant="contained" onClick={onNextClick}>
          Next
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
