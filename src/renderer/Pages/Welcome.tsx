import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AppRoutes } from '../Services/Constants';
import { useMemo, useState } from 'react';
import InfinityLogo from '../Assets/InfinityLogo';
import DiscordButton from '../Components/DiscordButton';
import { useHttpContext } from '../Services/http/HttpContext';
import { useNavigate } from 'react-router-dom';
import Announcements from '../Components/Announcements';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import useLocalStorage from '../Services/useLocalStorage';
import StorageKeys from '../Services/StorageKeys';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';

export default function Welcome() {
  const router = useNavigate();
  const theme = useTheme();
  const [logoClickCount, setLogoClickCount]: any = useState(0);
  const { devMode, setDevMode, devModeKey, setDevModeKey } = useHttpContext();
  const [clientFilesDate] = useLocalStorage(StorageKeys.lastInstallDate, null);
  const directoryQuery = GetDirectoryFileQuery();

  const newFilesAvailable = useMemo(
    () => {
      const serverFilesDate =
        directoryQuery.data &&
        new Date(directoryQuery.data['last-generated'] + 'Z'); //incredibly hacky, but it works

      if (directoryQuery?.data && serverFilesDate) {
        const newerFilesAvailable = serverFilesDate.getTime() > clientFilesDate;
        return {
          newerFilesAvailable: newerFilesAvailable,
          clientFilesDate: clientFilesDate && new Date(clientFilesDate),
          serverFilesDate: serverFilesDate && new Date(serverFilesDate),
        };
      }
      return null;
    },
    directoryQuery?.data,
  );

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
    display: 'flex',
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    gap: theme.spacing(1),
    alignItems: 'center',
  };
  const contentStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  };
  const logoContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    my: theme.spacing(6),
    '& svg': {
      width: '100%',
      height: '100%',
    },
  };

  const headerStyles = {
    fontSize: '5rem',
  };
  const titleStyles = {
    display: 'flex',
    gap: theme.spacing(2),
    // justifyContent: 'space-between',
    alignItems: 'center',
  };
  const subHeaderStyles = {
    fontSize: '2rem',
  };
  const textContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    flex: '1 0 auto',
  };

  return (
    <PageContainer>
      <PageContent>
        {/* Logo */}
        <Box sx={logoContainerStyles} onClick={onLogoClick}>
          <InfinityLogo devMode={devMode} />
        </Box>
        <Box sx={contentStyles}>
          {/* Text */}
          <Box sx={textContainerStyles}>
            <Box sx={titleStyles}>
              <Typography variant="h1" sx={headerStyles}>
                Infinity
              </Typography>
              {devMode && (
                <FormControl sx={{ mt: '1rem' }}>
                  <TextField
                    label="Dev Mode Key"
                    value={devModeKey}
                    onChange={(event) => setDevModeKey(event.target.value)}
                  />
                </FormControl>
              )}
            </Box>

            <Typography variant="h2" sx={subHeaderStyles}>
              Magoli's Compopack Installer for{' '}
              <span style={{ color: 'red' }}>7</span>
              DaysToDie
            </Typography>

            <Box sx={creditStyles}>
              <Typography variant="caption">Founded by Magoli</Typography>
              <Typography>•</Typography>
              <Typography variant="caption">Managed by Stallionsden</Typography>
              <Typography>•</Typography>
              <Typography variant="caption">
                Developed by Alexander Trimble
              </Typography>
            </Box>

            <Announcements />

            <Box>
              {clientFilesDate && newFilesAvailable?.newerFilesAvailable && (
                <Alert severity="info">
                  <AlertTitle>
                    Heads up: Our files have changed since your last install
                  </AlertTitle>
                  <Typography variant="caption">
                    {`You last installed on ${new Date(
                      newFilesAvailable.clientFilesDate,
                    ).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })} and our files were updated last on ${new Date(
                      newFilesAvailable.serverFilesDate,
                    ).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}.`}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Box>
        </Box>
      </PageContent>
      <PageFooter>
        <DiscordButton />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleBegin}
        >
          Begin
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
