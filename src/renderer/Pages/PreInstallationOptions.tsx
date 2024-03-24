import {
  Typography,
  Box,
  Paper,
  useTheme,
  Button,
  Alert,
  AlertTitle,
  Tooltip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';
import {
  InstallMethod,
  useSelectionContext,
} from '../Services/SelectionContext';
import { AppRoutes } from '../Services/Constants';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import { headerContainerStyles } from '../Services/CommonStyles';
import PageFooter from '../Components/PageFooter';
import ConfirmationDialog from '../Components/ConfirmationDialog';
import { useState } from 'react';

export default function PreInstallationOptions(props: any) {
  const fullSelection = useSelectionContext();
  const {
    moddedInstall,
    installMethod,
    setInstallMethod,
    excludeTraders,
    buildTeragonFiles,
    setBuildTeragonFiles,
  } = fullSelection;
  const theme = useTheme();
  const router = useNavigate();
  const { ipcRenderer } = window.electron;
  const [showConfirm, setShowConfirm] = useState(false);

  const onBackClick = () => {
    if (moddedInstall) {
      router(AppRoutes.optionalMods);
    } else {
      router(AppRoutes.vanillaOptionalMods);
    }
  };

  const onNextClick = () => {
    if (installMethod == InstallMethod.cleanInstall) {
      setShowConfirm(true);
    } else {
      router(AppRoutes.installation);
    }
  };

  const navigateToInstall = () => {
    setShowConfirm(false);
    router(AppRoutes.installation);
  };

  const onExportClick = () => {
    const selection = buildSelection();
    ipcRenderer.sendMessage('save-json-file', selection);
  };

  const buildSelection = () => {
    if (moddedInstall) {
      return {
        moddedInstall,
        excludeTraders,
        step1Selection: fullSelection.step1Selection,
        step2Selection: fullSelection.step2Selection,
        step3Selection: fullSelection.step3Selection,
      };
    } else {
      return {
        moddedInstall,
        excludeTraders,
        step4Selection: fullSelection.step4Selection,
      };
    }
  };

  // Styles
  const installationMethodContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    mt: theme.spacing(2),
    mb: theme.spacing(4),
    px: theme.spacing(2),
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
    filter: selected ? 'none' : 'grayscale(100%)',
  });

  const exportSelectionButtonStyles = { mr: 'auto' };
  const formControlStyles = {
    width: '100%',
  };
  const checkBoxStyles = {
    '& .MuiSvgIcon-root': { fontSize: '2rem' },
  };

  return (
    <PageContainer>
      <PageContent>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Install Options</Typography>
            <Typography variant="caption">
              Configure the behavior of your installation.
            </Typography>
          </Box>
        </Box>
        {/* Installation Type */}
        <Box sx={installationMethodContainerStyles}>
          {/* Clean Install */}
          <Paper
            onClick={() => {
              setInstallMethod(InstallMethod.cleanInstall);
            }}
            sx={installationTypeStyles(
              installMethod === InstallMethod.cleanInstall,
            )}
          >
            <Typography variant="h5">Clean Install</Typography>
            <Typography color="error">
              DANGER: This will wipe out the contents of the paths you specified
              for Mods & LocalPrefabs.
            </Typography>
          </Paper>
          {/* Overwrite */}
          <Paper
            onClick={() => {
              setInstallMethod(InstallMethod.overwrite);
            }}
            sx={installationTypeStyles(
              installMethod === InstallMethod.overwrite,
            )}
          >
            <Typography variant="h5">Overwrite</Typography>
            <Typography>
              Installs newly-selected files and overwrites existing files. No
              files will be deleted.
            </Typography>
          </Paper>
          {/* Missing Files Only */}
          <Paper
            onClick={() => {
              setInstallMethod(InstallMethod.quickInstall);
            }}
            sx={installationTypeStyles(
              installMethod === InstallMethod.quickInstall,
            )}
          >
            <Typography variant="h5">Quick Install</Typography>
            <Typography>
              Only download missing files which is a faster installation.
            </Typography>
          </Paper>
        </Box>
        {installMethod == InstallMethod.quickInstall && (
          <Alert severity={'warning'}>
            <AlertTitle>
              {
                'WARNING: If newer files are available, they will not be downloaded. Only recommended if your last installation was recent.'
              }
            </AlertTitle>
          </Alert>
        )}
        {installMethod == InstallMethod.cleanInstall && (
          <Alert severity={'error'}>
            <AlertTitle>
              {
                'DANGER: This will wipe out the contents of the paths you specified for Mods & LocalPrefabs.'
              }
            </AlertTitle>
          </Alert>
        )}
        {/* Terragon */}
        <Box sx={{ mt: theme.spacing(2) }}>
          <FormGroup sx={formControlStyles}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkBoxStyles}
                  checked={buildTeragonFiles}
                  onChange={() => setBuildTeragonFiles(!buildTeragonFiles)}
                />
              }
              label="Add Teragon Support"
            />
          </FormGroup>
          <FormHelperText>
            Check this if you use the Teragon map generator
          </FormHelperText>
        </Box>
      </PageContent>
      <PageFooter>
        <Tooltip title="Export your selection to a file. Can be imported at the Options step by another person to skip to this step.">
          <Button sx={exportSelectionButtonStyles} onClick={onExportClick}>
            Export Selection
          </Button>
        </Tooltip>
        <Button onClick={onBackClick}>Back</Button>
        <Button variant="contained" onClick={onNextClick}>
          Download & Install
        </Button>
        {/* Clean Install confirmation */}
        <ConfirmationDialog
          open={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={navigateToInstall}
          promptTitle="Are you sure you want to do a clean install?"
          promptDescription="This will delete the entire contents of the paths you specified!"
        />
      </PageFooter>
    </PageContainer>
  );
}
