import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Begin() {
  const router = useNavigate();

  //Functions
  const handleBack = () => {
    router('/');
  };

  //Styles
  const buttonContainerStyles = {
    justifyContent: 'space-between',
  };

  return (
    <div>
      <h1>Begin</h1>
      <Box sx={buttonContainerStyles}>
        <Button color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </div>
  );
}
