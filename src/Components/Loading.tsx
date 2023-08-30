import { Box, CircularProgress } from "@mui/material";

//Styles
const loadingContainerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
};

export default function Loading() {
  return (
    <Box sx={loadingContainerStyles}>
      <CircularProgress />
    </Box>
  );
}
