import { Box, Alert, AlertTitle, useTheme } from '@mui/material';
import {
  GetAnnouncementQuery,
  AnnouncementType,
} from '../Services/http/HttpFunctions';
import { useState } from 'react';

export default function Announcements() {
  const theme = useTheme();

  const announcementInfo = GetAnnouncementQuery(AnnouncementType.info);
  const announcementWarning = GetAnnouncementQuery(AnnouncementType.warning);
  const announcementError = GetAnnouncementQuery(AnnouncementType.error);
  const announcementSuccess = GetAnnouncementQuery(AnnouncementType.success);

  //   const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);

  const containerStyles = {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
    position: 'absolute',
  };

  return (
    <Box sx={containerStyles}>
      {announcementInfo.data && (
        <Alert severity="info" onClose={() => announcementInfo.remove()}>
          <AlertTitle>{announcementInfo.data}</AlertTitle>
        </Alert>
      )}
      {announcementWarning.data && (
        <Alert severity="warning" onClose={() => announcementWarning.remove()}>
          <AlertTitle>{announcementWarning.data}</AlertTitle>
        </Alert>
      )}
      {announcementError.data && (
        <Alert severity="error" onClose={() => announcementError.remove()}>
          <AlertTitle>{announcementError.data}</AlertTitle>
        </Alert>
      )}
      {announcementSuccess.data && (
        <Alert severity="success" onClose={() => announcementSuccess.remove()}>
          <AlertTitle>{announcementSuccess.data}</AlertTitle>
        </Alert>
      )}
    </Box>
  );
}
