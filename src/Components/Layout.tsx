import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import InstallTimeline from "./InstallTimeline";

export default function Layout() {
  //Styles
  const pageContainerStyles = {
    padding: "1rem",
    width: { xs: "100%", sm: "90%", md: "80%", lg: "65%", xl: "50%" },
    mx: "auto",
  };
  const layoutContainerStyles = {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
  };

  return (
    <Box sx={layoutContainerStyles}>
      <InstallTimeline />
      <Box sx={pageContainerStyles}>
        <Outlet />
      </Box>
    </Box>
  );
}
