import { useTheme } from "@emotion/react";

export const pageContainerStyles = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflow: "hidden",
  gap: "2rem",
  width: { xs: "100%", sm: "90%", md: "80%", lg: "75%", xl: "70%" },
  mx: "auto",
};

export const pageContentStyles = {
  flex: 1,
  overflow: "auto",
  width: "100%",
  p: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2rem" },

  //Scrollbar styles
  "&::-webkit-scrollbar": {
    width: "18px",
  },
  "&::-webkit-scrollbar-track": {
    // boxShadow: "inset 0 0 6px rgba(0,0,0,2)",
    // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "999px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,0.1)",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    "&:active": {
      backgroundColor: "rgba(255,255,255,0.3)",
    },
    borderRadius: "999px",
  },
};

export const pageFooterStyles = {
  flexShrink: 0,
  display: "flex",
  gap: "1rem",
  justifyContent: "end",
  p: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2rem" },
};
