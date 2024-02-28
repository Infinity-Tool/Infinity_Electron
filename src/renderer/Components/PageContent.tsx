import { Box } from '@mui/material';

export default function PageContent(props: any) {
  const pageContentStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    width: '100%',
    p: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
  };

  return <Box sx={pageContentStyles}>{props.children}</Box>;
}
