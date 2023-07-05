import { Box, Button, Typography } from "@mui/material";
import { buttonContainerStyles } from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Agreement() {
  const router = useNavigate();
  const [agreementChecked, setAgreementChecked] = useState(false);

  //Functions
  const handleBack = () => {
    router(AppRoutes.welcome);
  };
  const handleNext = () => {
    router(AppRoutes.options);
  };

  return (
    <Box>
      <Typography>Agreement</Typography>

      <Box sx={buttonContainerStyles}>
        <Button color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
