import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';

export default function Canceled() {
  // const { ipcRenderer } = window.require('electron');
  const { ipcRenderer } = window.electron;
  const router = useNavigate();

  const handleChangeSelection = () => {
    router(AppRoutes.citiesAndSettlements);
  };

  const handleClose = () => {
    ipcRenderer.sendMessage('close-app');
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Typography variant="h3">Installation Canceled ☹️</Typography>
        <Typography>
          Note: Some files may have been downloaded to your selected folders.
        </Typography>
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={handleChangeSelection}>Change Selection</Button>
        <Button
          variant="contained"
          // color="primary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
}
