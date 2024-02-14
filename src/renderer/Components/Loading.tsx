import { Box, CircularProgress } from '@mui/material';
import { centerContentStyles } from '../Services/CommonStyles';

export default function Loading() {
  return (
    <Box sx={centerContentStyles}>
      <CircularProgress />
    </Box>
  );
}
