import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../Services/Constants";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import InfinityLogo from "Assets/InfinityLogo";
import Discord from "Components/Discord";
import { useState } from "react";
import { useHttpContext } from "Services/http/BaseUrlContext";

export default function Welcome() {
  const router = useNavigate();
  const theme = useTheme();
  const [logoClickCount, setLogoClickCount]: any = useState(0);
  const { devMode, setDevMode, devModeKey, setDevModeKey } = useHttpContext();

  //Functions
  const handleBegin = () => {
    router(AppRoutes.agreement);
  };
  const onLogoClick = () => {
    setLogoClickCount((prev: any) => prev + 1);
    if (logoClickCount >= 8) {
      setDevMode((prev: any) => !prev);
      setLogoClickCount(0);
    }
  };

  //Styles
  const creditStyles = {
    display: "flex",
    fontSize: "1rem",
    color: theme.palette.text.secondary,
    gap: theme.spacing(1),
    alignItems: "center",
  };

  const logoContainerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    "& svg": {
      maxHeight: "50%",
      maxWidth: "50%",
    },
    mb: theme.spacing(2),
  };

  const infinityTitleStyles = {
    fontSize: "5rem",
  };
  const subHeaderStyles = {
    fontSize: "2rem",
  };
  const listOfTextStyles = {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={logoContainerStyles} onClick={onLogoClick}>
          <InfinityLogo devMode={devMode} />
        </Box>
        <Typography variant="h1" sx={infinityTitleStyles}>
          Infinity
        </Typography>
        <Box sx={listOfTextStyles}>
          <Typography variant="h2" sx={subHeaderStyles}>
            Magoli's Compopack
          </Typography>
          <Typography>
            A mod and custom prefab installer for{" "}
            <span style={{ color: "red" }}>7</span>
            DaysToDie
          </Typography>
          <Box sx={creditStyles}>
            <Typography variant="caption">Founded by Magoli</Typography>
            <Typography>•</Typography>
            <Typography variant="caption">Managed by Stallionsden</Typography>
            <Typography>•</Typography>
            <Typography variant="caption">Developed by bent head</Typography>
          </Box>
        </Box>
        {devMode && (
          <FormControl sx={{ mt: "1rem" }}>
            <TextField
              label="Dev Mode Key"
              value={devModeKey}
              onChange={(event) => setDevModeKey(event.target.value)}
            />
          </FormControl>
        )}
      </Box>
      <Box sx={pageFooterStyles}>
        <Discord />
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
