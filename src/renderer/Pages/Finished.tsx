import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DiscordButton from '../Components/DiscordButton';
import PatreonButton from '../Components/PatreonButton';
import { centerContentStyles } from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { useSelectionContext } from '../Services/SelectionContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';

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
    <PageContainer>
      <PageContent>
        <Box sx={centerContentStyles}>
          <Box sx={headerMessageStyles}>
            <Typography variant="h1">Installation Complete</Typography>
            <FontAwesomeIcon icon={faCheckSquare} color="success" />
            <Typography>Thank you for using Infinity!</Typography>
          </Box>

          <Box sx={externalButtonContainerStyles}>
            <PatreonButton />
            <DiscordButton />
          </Box>
        </Box>
      </PageContent>

      <PageFooter>
        <Button onClick={handleChangeSelection}>Change Selection</Button>
        <Button
          variant="contained"
          // color="primary"
          onClick={handleClose}
        >
          EXIT
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
