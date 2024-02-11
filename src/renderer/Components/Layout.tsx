import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import InstallTimeline from './InstallTimeline';

export default function Layout() {
  //Styles

  const layoutContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
  };

  return (
    <Box sx={layoutContainerStyles}>
      <InstallTimeline />
      <Outlet />
    </Box>
  );
}
