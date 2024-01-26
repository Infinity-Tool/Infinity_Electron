import { Box, Alert, AlertTitle, useTheme } from '@mui/material';
import {
  GetAnnouncementQuery,
  AnnouncementType,
} from '../Services/http/HttpFunctions';
import useSessionStorage from '../Services/useSessionStorage';
import StorageKeys from '../Services/StorageKeys';

export default function Announcements() {
  const theme = useTheme();

  const announcementInfo = GetAnnouncementQuery(AnnouncementType.info);
  const announcementWarning = GetAnnouncementQuery(AnnouncementType.warning);
  const announcementError = GetAnnouncementQuery(AnnouncementType.error);
  const announcementSuccess = GetAnnouncementQuery(AnnouncementType.success);

  const [dismissedAnnouncements, setDismissedAnnouncements]: any =
    useSessionStorage(StorageKeys.dismissedAlerts, []);

  const containerStyles = {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
    position: 'absolute',
  };

  const dismissAlert = (type: AnnouncementType) => {
    setDismissedAnnouncements((prev: any) => [...prev, type]);
  };

  const renderAnnouncement = (query: any, type: AnnouncementType) => {
    if (!dismissedAnnouncements.includes(type) && query.data) {
      return (
        <Alert severity={type} onClose={() => dismissAlert(type)}>
          <AlertTitle>{query.data}</AlertTitle>
        </Alert>
      );
    }
    return null;
  };

  return (
    <Box sx={containerStyles}>
      {renderAnnouncement(announcementInfo, AnnouncementType.info)}
      {renderAnnouncement(announcementWarning, AnnouncementType.warning)}
      {renderAnnouncement(announcementError, AnnouncementType.error)}
      {renderAnnouncement(announcementSuccess, AnnouncementType.success)}
    </Box>
  );
}
