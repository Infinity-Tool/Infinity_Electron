import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../Services/Constants";
import LogoBanner from "../Assets/logo_banner.png";

export default function Welcome() {
  const router = useNavigate();

  const handleBegin = () => {
    router(routes.options);
  };
  const getFilePath = () => {};

  //Syles
  const page = {
    padding: "1rem",
  };
  const buttonContainerStyles = {
    justifyContent: "end",
    display: "flex",
  };
  const creditStyles = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={page}>
      <Box
        component="img"
        sx={{
          maxWidth: "100%",
          width: 1000,
        }}
        alt="Infinity Logo"
        src={LogoBanner}
      />
      <Box sx={creditStyles}>
        <Typography variant="caption">Founder: Magoli</Typography>
        <Typography variant="caption">Infinity Team: Stallionsden</Typography>
        <Typography variant="caption" color="text.secondary">
          Join our Discord!
        </Typography>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleBegin}
        >
          Begin
        </Button>
      </Box>
    </div>
  );
}
