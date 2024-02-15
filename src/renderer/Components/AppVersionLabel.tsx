import { Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState, version } from 'react';

export default function AppVersionLabel() {
  const { ipcRenderer } = window.electron;
  const [versionRequested, setVersionRequested] = useState(false);
  const [version, setVersion]: any = useState();

  useEffect(() => {
    if (ipcRenderer && !versionRequested) {
      setVersionRequested(true);
      request();
    }
  }, [ipcRenderer]);

  useEffect(() => {
    ipcRenderer.on('app-version', (version: any) => {
      setVersion(version);
    });
    return () => {
      ipcRenderer.removeAllListeners('app-version');
    };
  }, [ipcRenderer]);

  const request = () => {
    ipcRenderer.sendMessage('get-app-version');
  };

  const versionFormatted = useMemo(() => {
    if (version) {
      return `v${version.raw}`;
    }
    return '';
  }, [version]);

  const theme = useTheme();
  const versionStyles = {
    color: theme.palette.text.secondary,
  };

  return (
    <Typography sx={versionStyles} variant="caption">
      {versionFormatted}
    </Typography>
  );
}
