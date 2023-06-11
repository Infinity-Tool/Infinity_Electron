import { Box, Button, Typography } from '@mui/material';
import Logobanner from '/assets/logo_banner.png';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const router = useNavigate();

  //Queries
  // const testQuery = useQuery('test', () => {});

  //Functions
  const handleBegin = () => {
    router('/begin');
  };

  //Syles
  const page = {
    padding: '1rem',
  };
  const buttonContainerStyles = {
    justifyContent: 'end',
    display: 'flex',
  };
  const creditStyles = {
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={page}>
      <Box
        component="img"
        sx={{
          maxWidth: '100%',
          width: 1000,
        }}
        alt="Infinity Logo"
        //assets/logo_banner.png
        src={Logobanner}
      />
      <Box sx={creditStyles}>
        <Typography variant="caption">Founder: Magoli</Typography>
        <Typography variant="caption">Infinity Team: Stallionsden</Typography>
        <Typography variant="caption" color="text.secondary">
          Join our Discord!
        </Typography>
      </Box>

      <Box sx={buttonContainerStyles}>
        <Button variant="contained" color="primary" onClick={handleBegin}>
          Begin
        </Button>
      </Box>
    </div>
  );
}
