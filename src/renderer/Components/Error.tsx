import { Box, Button } from '@mui/material';

//Styles
const errorContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
};

export default function Error(props: any) {
  const { message, retryFn } = props;
  return (
    <Box sx={errorContainerStyles}>
      <h2>{message}</h2>
      <h4>If it keeps happening then try checking for updates.</h4>
      <Button onClick={() => retryFn()}>Retry</Button>
    </Box>
  );
}
