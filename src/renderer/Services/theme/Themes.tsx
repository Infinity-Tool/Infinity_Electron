import '@fontsource/roboto';
import '@fontsource/poiret-one';
import '@fontsource/viga';
import '@fontsource/oswald';
import '@fontsource/chela-one';
import shadows from '@mui/material/styles/shadows';

const componentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
      },
    },
  },
  MuiChip: {
    // make primary chip color darker
    styleOverrides: {
      colorPrimary: {
        backgroundColor: '#22ab82',
      },
      colorDefault: {
        color: '#b0b0b0',
      },
    },
  },
};
const typography = {
  fontFamily: 'Roboto',
  h1: {
    fontFamily: 'Oswald',
    fontSize: '3rem',
  },
  h2: {
    fontFamily: 'Oswald',
    fontSize: '2.5rem',
  },
  h3: {
    fontFamily: 'Oswald',
    fontSize: '2rem',
  },
  h4: {
    fontFamily: 'Oswald',
  },
  h5: {
    fontFamily: 'Oswald',
  },
  h6: {
    fontFamily: 'Oswald',
  },
};
const noShadows = {
  1: 'none',
  2: 'none',
  3: 'none',
  4: 'none',
  5: 'none',
  6: 'none',
  7: 'none',
  8: 'none',
  9: 'none',
  10: 'none',
  11: 'none',
  12: 'none',
  13: 'none',
  14: 'none',
  15: 'none',
  16: 'none',
  17: 'none',
  18: 'none',
  19: 'none',
  20: 'none',
};

const baseTheme = {
  typography: typography,
  // components: componentOverrides,
  // shadows: shadowOverrides,
};

const darkThemeComponentOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      '&::-webkit-scrollbar': {
        width: '15px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '999px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255,255,255,0.2)',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.3)',
        },
        '&:active': {
          backgroundColor: 'rgba(255,255,255,0.4)',
        },
        borderRadius: '999px',
      },
    },
  },
};

const lightThemeComponentOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      '&::-webkit-scrollbar': {
        width: '15px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: '999px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
        '&:active': {
          backgroundColor: 'rgba(0,0,0,0.4)',
        },
        borderRadius: '999px',
      },
    },
  },
};

export const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#3AFFC4',
      // main: "#ff0000",
    },
    secondary: {
      main: '#DD1F26',
    },
    background: {
      default: '#282828',
      defaultDarker: '#101010',
      paper: '#070707',
    },
  },
  ...baseTheme,
  shadows: noShadows,
  components: { ...componentOverrides, ...darkThemeComponentOverrides },
};

export const lightTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#009569',
    },
    secondary: {
      main: '#DD1F26',
    },
    background: {
      default: '#fff',
      defaultDarker: '#f8f8f8',
      paper: '#f2f2f2',
    },
  },
  ...baseTheme,
  components: { ...componentOverrides, ...lightThemeComponentOverrides },
};

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
