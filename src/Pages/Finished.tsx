import { Box, Button, Typography } from "@mui/material";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import { useNavigate } from "react-router";

export default function Finished() {
  // router
  const router = useNavigate();

  const handleChangeSelection = () => {
    router(AppRoutes.citiesAndSettlements);
  };

  const handleClose = () => {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("close-app");
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Typography variant="h5">Installation Complete</Typography>
        <Typography>Thank you for using Infinity!</Typography>
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
