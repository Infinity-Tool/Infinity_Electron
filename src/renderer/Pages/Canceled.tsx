import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centerContentStyles } from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { useSelectionContext } from '../Services/SelectionContext';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';

export default function Canceled() {
  const { moddedInstall } = useSelectionContext();
  const { ipcRenderer } = window.electron;
  const router = useNavigate();

  const handleChangeSelection = () => {
    if (moddedInstall) {
      router(AppRoutes.citiesAndSettlements);
    } else {
      router(AppRoutes.vanillaPois);
    }
  };

  const handleClose = () => {
    ipcRenderer.sendMessage('close-app');
  };

  return (
    <PageContainer>
      <PageContent>
        <Box sx={centerContentStyles}>
          <Typography variant="h1">Installation Canceled ❌</Typography>
          <Typography color={'text.secondary'}>
            Note: Some files may have been downloaded to your selected folders.
          </Typography>
        </Box>
      </PageContent>
      <PageFooter>
        <Button onClick={handleChangeSelection}>Change Selection</Button>
        <Button variant="contained" onClick={handleClose} color={'error'}>
          Exit
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
