import "@fontsource/roboto";

export default function GetTheme(): any {
  return {
    palette: {
      mode: "dark",
      primary: {
        main: "#3AFFC4",
      },
      secondary: {
        main: "#FFFFFF",
      },
      background: {
        default: "#1E1E1E",
        paper: "#000000",
      },
    },
    typography: {
      fontFamily: "Roboto",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "uppercase",
            fontWeight: "bold",
          },
        },
      },
    },
  };
}
