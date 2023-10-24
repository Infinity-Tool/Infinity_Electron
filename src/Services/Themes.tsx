import "@fontsource/roboto";
import "@fontsource/poiret-one";

export default function GetTheme(): any {
  return {
    palette: {
      mode: "dark",
      primary: {
        main: "#3AFFC4",
        // main: "#ff0000",
      },
      secondary: {
        main: "#FFFFFF",
      },
      background: {
        default: "#1E1E1E",
        defaultDarker: "#101010",
        paper: "#070707",
      },
    },
    typography: {
      fontFamily: "Roboto",
      h1: {
        fontFamily: "Poiret One",
        fontSize: "2rem",
      },
      h2: {
        fontFamily: "Poiret One",
      },
      h3: {
        fontFamily: "Poiret One",
      },
      h4: {
        fontFamily: "Poiret One",
      },
      h5: {
        fontFamily: "Poiret One",
      },
      h6: {
        fontFamily: "Poiret One",
      },
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
