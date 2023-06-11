import { Box, Button } from '@mui/material';
import Logobanner from '/assets/logo_banner.png';

export default function Welcome() {
  const buttonContainerStyles = {
    display: 'flex',
  };

  return (
    <>
      <div>
        <Box
          component="img"
          sx={{
            maxWidth: '100%',
            width: 1000,
            // height: 233,
            // width: 350,
            // maxHeight: { xs: 233, md: 167 },
            // maxWidth: { xs: 350, md: 250 },
          }}
          alt="Infinity Logo"
          //assets/logo_banner.png
          src={Logobanner}
        />
      </div>
      <Box sx={buttonContainerStyles}>
        <Button variant="contained" color="primary">
          Begin
        </Button>
      </Box>
    </>
  );
}
