import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';
import { AppRoutes } from '../Services/Constants';
import { AgreementQuery } from '../Services/http/HttpFunctions';
import Error from '../Components/Error';
import useSessionStorage from '../Services/useSessionStorage';
import StorageKeys from '../Services/StorageKeys';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';
import { headerContainerStyles } from '../Services/CommonStyles';

export default function Agreement() {
  const router = useNavigate();
  const [agreementChecked, setAgreementChecked] = useSessionStorage(
    StorageKeys.agreementAccepted,
    false,
  );
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

  const agreementTextStyles = {
    fontWeight: 'bold',
  };

  return (
    <PageContainer>
      <PageContent>
        <Box sx={headerContainerStyles}>
          <Typography variant="h1">Agreement</Typography>
        </Box>

        {agreementQuery.isLoading && <Loading />}
        {agreementQuery.isError && (
          <Error
            message={'There was a problem loading the user agreement.'}
            retryFn={() => agreementQuery.refetch()}
          />
        )}

        <Paper sx={agreementContainerStyles}>
          {agreementQuery.data?.split('\n').map((p: string) => (
            <Typography variant="caption" sx={agreementTextStyles}>
              {p}
            </Typography>
          ))}
        </Paper>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                value={agreementChecked}
                defaultChecked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
              />
            }
            label="I Agree"
          />
        </FormGroup>
      </PageContent>
      <PageFooter>
        <Button color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!agreementChecked || !agreementQuery.isSuccess}
        >
          Next
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
