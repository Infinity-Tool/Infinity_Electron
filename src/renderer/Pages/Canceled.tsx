import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  centerContentStyles,
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { useSelectionContext } from '../Services/SelectionContext';

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
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={centerContentStyles}>
          <Typography variant="h1">Installation Canceled ❌</Typography>
          <Typography color={'text.secondary'}>
            Note: Some files may have been downloaded to your selected folders.
          </Typography>
        </Box>
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={handleChangeSelection}>Change Selection</Button>
        <Button variant="contained" onClick={handleClose} color={'error'}>
          Exit
        </Button>
      </Box>
    </Box>
  );
}
