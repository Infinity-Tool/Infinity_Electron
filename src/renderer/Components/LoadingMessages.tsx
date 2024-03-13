import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { GetLoadingMessagesQuery } from '../Services/http/HttpFunctions';

export default function LoadingMessages(props: any) {
  const theme = useTheme();
  const [message, setMessage] = useState('');

  const loadingMessagesQuery = GetLoadingMessagesQuery();
  const loadingMessages = useMemo(
    () => loadingMessagesQuery.data ?? [],
    [loadingMessagesQuery],
  );
  // const [messagesStarted, setMessagesStarted] = useSessionStorage(
  //   'loadingMessagesStarted',
  //   false,
  // );

  const updateLoadingMessage = () => {
    const randomLoadingMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setMessage(randomLoadingMessage);

    setInterval(() => {
      updateLoadingMessage();
    }, 20000);
  };

  useEffect(() => {
    if (loadingMessages.length > 0) {
      updateLoadingMessage();
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

  return (
    <Box sx={messageContainerStyles}>
      <Typography>{message}</Typography>
    </Box>
  );
}
