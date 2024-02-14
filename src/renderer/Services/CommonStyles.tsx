export const pageContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  gap: '0.5rem',
  width: { xs: '100%', sm: '90%', md: '80%', lg: '75%', xl: '70%' },
  mx: 'auto',
};

export const pageContentStyles = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  width: '100%',
  p: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
  // ...scrollBarStyles,
};

export const pageFooterStyles = {
  flexShrink: 0,
  display: 'flex',
  gap: '1rem',
  justifyContent: 'end',
  p: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
};

export const headerContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  mb: '1.5rem',
};

export const noUnderlineTextFieldStyles = {
  '& .MuiInput-underline:before': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:after': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:hover': {
    borderBottom: 'none',
  },
};

export const dialogStyles = {
  padding: '2rem',
};

export const poiStyles = (theme: any, selected: boolean): any => ({
  paddingY: theme.spacing(1),
  paddingX: theme.spacing(2),
  marginY: theme.spacing(1.5),
  // border: `1px solid ${
  //   selected ? theme.palette.primary.dark : theme.palette.divider
  // }`,
  // display: "flex",
  justifyContent: 'space-between',
  borderLeft: `6px solid ${
    selected ? theme.palette.primary.dark : theme.palette.text.secondary
  }`,
  //gradient from primary to transparent, bottom left to top right. gradient should be 30% opacity using rgba and

  // background: `linear-gradient(60deg, ${
  //   selected ? theme.palette.primary.dark : 'transparent'
  // } 0%, transparent 100%)`,
});

export const centerContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};
