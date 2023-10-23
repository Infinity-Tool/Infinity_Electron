import { Box, Button, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../Services/Constants";
import LogoBanner from "../Assets/logo_banner.png";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";

export default function Welcome() {
  const router = useNavigate();

  //Functions
  const handleBegin = () => {
    router(AppRoutes.agreement);
  };
  const handleDiscordClick = () => {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("open-discord");
  };

  //Styles
  const creditStyles = {
    display: "flex",
    flexDirection: "column",
  };
  const logoStyles = {
    width: "100%",
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box
          component="img"
          sx={logoStyles}
          alt="Infinity Logo"
          src={LogoBanner}
        />
        <Box sx={creditStyles}>
          <Typography variant="caption">Founder: Magoli</Typography>
          <Typography variant="caption">Infinity Team: Stallionsden</Typography>
          {/* <Typography variant="caption" color="text.secondary">
            Join our Discord!
          </Typography> */}
        </Box>
        <Button color="primary" onClick={handleDiscordClick}>
          Join our Discord
        </Button>
      </Box>
      <Box sx={pageFooterStyles}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleBegin}
        >
          Begin
        </Button>
      </Box>
    </Box>
  );
}
