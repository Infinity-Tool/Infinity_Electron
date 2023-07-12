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
        defaultDarker: "#101010",
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
      MuiBox: {
        styleOverrides: {
          root: {
            backgroundColor: "red !important",
          },
        },
      },
    },
    //update global scrollbar
    // overrides: {
    //   MuiCssBaseline: {
    //     "@global": {
    //       "*::-webkit-scrollbar": {
    //         width: "0.4em",
    //       },
    //       "*::-webkit-scrollbar-track": {
    //         boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    //         webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    //       },
    //       "*::-webkit-scrollbar-thumb": {
    //         backgroundColor: "rgba(0,0,0,.1)",
    //         outline: "1px solid slategrey",
    //       },
    //     },
    //   },
    // },
  };
}
