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
};

export const pageFooterStyles = {
  flexShrink: 0,
  display: "flex",
  gap: "1rem",
  justifyContent: "end",
  p: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2rem" },
};
