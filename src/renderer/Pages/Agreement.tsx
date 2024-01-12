import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { AgreementQuery } from '../Services/http/HttpFunctions';
import Error from '../Components/Error';

export default function Agreement() {
  const router = useNavigate();
  const [agreementChecked, setAgreementChecked] = useState(false);
  const agreementQuery = AgreementQuery();

  const handleBack = () => {
    router(AppRoutes.welcome);
  };
  const handleNext = () => {
    router(AppRoutes.options);
  };

  //Styles
  const agreementContainerStyles = {
    color: 'text.secondary',
    my: '1rem',
    p: '1rem',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Typography variant="h5">Agreement</Typography>

        {agreementQuery.isLoading && <Loading />}
        {agreementQuery.isError && (
          <Error
            message={'There was a problem loading the user agreement.'}
            retryFn={() => agreementQuery.refetch()}
          />
        )}

        <Paper sx={agreementContainerStyles}>
          {agreementQuery.data
            ?.split('\n')
            .map((p: string) => <Typography variant="caption">{p}</Typography>)}
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
      </Box>
      <Box sx={pageFooterStyles}>
        <Button color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!agreementChecked || agreementQuery.isLoading == null}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
