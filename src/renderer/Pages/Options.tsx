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
import FolderHelpDialog from '../Components/FolderHelpDialog';
import { headerContainerStyles } from '../Services/CommonStyles';

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
  const directorySelectHeaderStyles = {
    display: 'flex',
    alignContent: 'center',
    gap: theme.spacing(2),
    mb: theme.spacing(2),
  };
  const errorMessageContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    mb: theme.spacing(2),
  };

  return (
    <PageContainer>
      <PageContent>
        <Box sx={headerContainerStyles}>
          <Typography variant="h1">Options</Typography>
        </Box>
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
                  {showcaseModded && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={`${baseUrl}/Showcase_Modded/${showcaseModded[0]}`}
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Modded (Recommended)
                    </Typography>
                    <Typography variant="caption">
                      Includes Custom settlements, Towns and Cities. POIs use
                      both the Custom Block Pack and Compopack mods (both server
                      side only). Some Optional Mods use custom blocks from
                      Unity. POI Count: 3000+
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
                  {showcaseUnmodded && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={`${baseUrl}/Showcase_Unmodded/${showcaseUnmodded[0]}`}
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Unmodded
                    </Typography>
                    <Typography variant="caption">
                      Contains pois not modded and only spawn in vanilla cities,
                      towns, wilderness and gateway. Max zombie cap of 250, POI
                      Count: 1100+
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>

            <Box>
              <Box sx={directorySelectHeaderStyles}>
                <Typography variant="h5">
                  Select Installation Directories
                </Typography>
                <Button
                  sx={helpButtonStyles}
                  onClick={() => setHelpDialogOpen(true)}
                >
                  Help
                </Button>
              </Box>

              <FolderHelpDialog
                helpDialogOpen={helpDialogOpen}
                setHelpDialogOpen={setHelpDialogOpen}
              />
            </Box>

            {/* Error Message */}
            {hasErrors && (
              <Box sx={errorMessageContainerStyles}>
                <Typography color="error" variant="h6">
                  Invalid folder path(s) provided
                </Typography>
                <Typography color="error">
                  Paths must have "Mods", "LocalPrefabs", or "7Days" in it and
                  it must not be a root folder.
                </Typography>
              </Box>
            )}

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

              {/* Exclude Traders */}
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
        <Button variant="contained" onClick={onNextClick} disabled={hasErrors}>
          Next
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
