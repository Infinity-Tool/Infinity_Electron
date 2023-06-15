import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  //Styles
  const pageContainerStyles = {
    padding: '1rem',
    maxWidth: { xs: '100%', sm: '90%', md: '80%' },
    mx: 'auto',
  };

  return (
    <Box sx={pageContainerStyles}>
      <Outlet />
    </Box>
  );
}
