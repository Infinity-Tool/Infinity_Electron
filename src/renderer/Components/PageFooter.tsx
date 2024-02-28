import { Box } from '@mui/material';

export default function PageFooter(props: any) {
  const pageFooterStyles = {
    flexShrink: 0,
    display: 'flex',
    gap: '1rem',
    justifyContent: 'end',
    p: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
  };

  return <Box sx={pageFooterStyles}>{props.children}</Box>;
}
