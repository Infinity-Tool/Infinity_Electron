import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import InstallTimeline from "./InstallTimeline";

export default function Layout() {
  //Styles

  const layoutContainerStyles = {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    width: "100vw",
  };

  return (
    <Box sx={layoutContainerStyles}>
      <InstallTimeline />
      <Outlet />
    </Box>
  );
}
