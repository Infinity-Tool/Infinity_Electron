import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
import Loading from "Components/Loading";
import { buttonContainerStyles } from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import { GetAgreementHttp } from "Services/http/Agreement";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Agreement() {
  const router = useNavigate();
  const [userAgreement, setUserAgreement]: any = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [testArray, setTestArray]: any = useState();

  useEffect(() => {
    fetchUserAgreement();
  }, []);

  //Functions
  const fetchUserAgreement = async () => {
    GetAgreementHttp().then((res) => {
      setTestArray(res.split("\n"));
      setUserAgreement(res);
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
    m: "1rem",
    p: "1rem",
    height: "60vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
  };

  return (
    <Box>
      <Typography variant="h5">Agreement</Typography>

      <Paper sx={agreementContainerStyles}>
        {/* {userAgreement ? <Typography>{userAgreement}</Typography> : <Loading />} */}
        {testArray ? (
          testArray.map((p: string) => (
            <Typography variant="caption">{p}</Typography>
          ))
        ) : (
          <Loading />
        )}
      </Paper>
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
