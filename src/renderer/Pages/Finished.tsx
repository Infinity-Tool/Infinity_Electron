import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DiscordButton from '../Components/DiscordButton';
import PatreonButton from '../Components/PatreonButton';
import {
  centerContentStyles,
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { useSelectionContext } from '../Services/SelectionContext';

export default function Finished() {
  // const { ipcRenderer } = window.require('electron');
  const { moddedInstall } = useSelectionContext();
  const { ipcRenderer } = window.electron;
  const theme = useTheme();
  const router = useNavigate();

  const handleChangeSelection = () => {
    if (moddedInstall) router(AppRoutes.citiesAndSettlements);
    else router(AppRoutes.vanillaPois);
  };

  const handleClose = () => {
    ipcRenderer.sendMessage('close-app');
  };

  //Styles
  const headerMessageStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  };

  const externalButtonContainerStyles = {
    display: 'flex',
    justifyContent: 'space-around',
    gap: theme.spacing(2),
    mt: theme.spacing(4),
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={centerContentStyles}>
          <Box sx={headerMessageStyles}>
            <Typography variant="h1">Installation Complete ✅</Typography>
            <Typography>Thank you for using Infinity!</Typography>
          </Box>

          <Box sx={externalButtonContainerStyles}>
            <PatreonButton />
            <DiscordButton />
          </Box>
        </Box>
      </Box>

      <Box sx={pageFooterStyles}>
        <Button onClick={handleChangeSelection}>Change Selection</Button>
        <Button
          variant="contained"
          // color="primary"
          onClick={handleClose}
        >
          EXIT
        </Button>
      </Box>
    </Box>
  );
}
