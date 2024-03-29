import { Box } from '@mui/material';

export default function PageContainer(props: any) {
  const pageContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    gap: '0.5rem',
    width: { xs: '100%', sm: '90%', md: '80%', lg: '75%', xl: '70%' },
    mx: 'auto',
    // px: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
  };

  return <Box sx={pageContainerStyles}>{props.children}</Box>;
}
