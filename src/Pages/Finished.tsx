import { Box, Button, Typography, useTheme } from "@mui/material";
import DiscordButton from "Components/DiscordButton";
import PatreonButton from "Components/PatreonButton";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import { useNavigate } from "react-router";

export default function Finished() {
  const router = useNavigate();
  const { ipcRenderer } = window.require("electron");

  const handleChangeSelection = () => {
    router(AppRoutes.citiesAndSettlements);
  };

  const handleClose = () => {
    ipcRenderer.send("close-app");
  };

  //Styles
  const headerMessageStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  };

  const externalButtonContainerStyles = {
    display: "flex",
    justifyContent: "space-around",
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={headerMessageStyles}>
          <Typography variant="h1">Installation Complete</Typography>
          <Typography>Thank you for using Infinity!</Typography>
        </Box>

        <Box sx={externalButtonContainerStyles}>
          <PatreonButton />
          <DiscordButton />
        </Box>
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
