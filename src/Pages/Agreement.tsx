import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import Loading from "Components/Loading";
import { buttonContainerStyles } from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import { GetAgreementHttp } from "Services/http/Agreement";
import { GetDirectoryFileHttp } from "Services/http/Directory";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Agreement() {
  const router = useNavigate();
  const [userAgreement, setUserAgreement]: any = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);

  useEffect(() => {
    fetchUserAgreement();
  }, []);

  //Functions
  const fetchUserAgreement = async () => {
    GetAgreementHttp().then((res) => {
      const formattedAgreement = res.replaceAll("\\n", "<br/>");
      setUserAgreement(formattedAgreement);
    });
  };

  const handleBack = () => {
    router(AppRoutes.welcome);
  };
  const handleNext = () => {
    router(AppRoutes.options);
  };

  //Styles
  const agreementContainerStyles = {
    color: "text.secondary",
    m: "2rem",
    height: "50vh",
    overflow: "auto",
  };

  return (
    <Box>
      <Typography variant="h5">Agreement</Typography>

      <Box sx={agreementContainerStyles}>
        {userAgreement ? <Typography>{userAgreement}</Typography> : <Loading />}
      </Box>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              value={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
            />
          }
          label="I Agree"
        />
      </FormGroup>

      <Box sx={buttonContainerStyles}>
        <Button color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!agreementChecked || userAgreement == null}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
