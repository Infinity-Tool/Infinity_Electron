import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { GetLoadingMessagesQuery } from '../Services/http/HttpFunctions';

export default function LoadingMessages(props: any) {
  const theme = useTheme();
  const [loadingMessages, setLoadingMessages]: any = useState([]);
  const [message, setMessage] = useState(null);

  const loadingMessagesQuery = GetLoadingMessagesQuery(setLoadingMessages);

  const updateMessage = () => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    setMessage(loadingMessages[randomIndex]);
  };

  const cycleMessages = () => {
    const interval = setInterval(() => {
      updateMessage();
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  };

  useEffect(() => {
    if (loadingMessages?.length > 0 && message == null) {
      updateMessage();
      cycleMessages();
    }
  }, [loadingMessages]);

  // Styles
  const messageContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mt: theme.spacing(2),
    mb: theme.spacing(6),
    textAlign: 'center',
  };

  const messageStyles = {
    fontSize: '1.2rem',
  };

  return (
    <Box sx={messageContainerStyles}>
      <Typography sx={messageStyles}>{message}</Typography>
    </Box>
  );
}
