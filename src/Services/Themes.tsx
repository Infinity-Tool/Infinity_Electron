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
        main: "#DD1F26",
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
        fontSize: "3rem",
      },
      h2: {
        fontFamily: "Poiret One",
        fontSize: "2.5rem",
      },
      h3: {
        fontFamily: "Poiret One",
        fontSize: "2rem",
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
      MuiChip: {
        // make primary chip color darker
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "#22ab82",
          },
          colorDefault: {
            color: "#b0b0b0",
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
