import { Typography, Box, Paper, useTheme, Button } from '@mui/material';
import {
  InstallMethod,
  useSelectionContext,
} from '../Services/SelectionContext';
import {
  headerContainerStyles,
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { useNavigate } from 'react-router-dom';

export default function PreInstallationOptions(props: any) {
  const { moddedInstall, installMethod, setInstallMethod } =
    useSelectionContext();
  const theme = useTheme();
  const router = useNavigate();

  const onBackClick = () => {
    if (moddedInstall) {
      router(AppRoutes.optionalMods);
    } else {
      router(AppRoutes.vanillaPois);
    }
  };

  const onNextClick = () => {
    router(AppRoutes.installation);
  };

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

  const warningStyles = {
    color: theme.palette.warning.main,
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Install Options</Typography>
            <Typography variant="caption">
              Configure the behavior of your installation.
            </Typography>
          </Box>
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
          Download & Install
        </Button>
      </Box>
    </Box>
  );
}
