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
  justifyContent: 'space-between',
  borderLeft: `6px solid ${
    selected ? theme.palette.primary.dark : theme.palette.text.secondary
  }`,
  //lighten background with filter
  filter: selected ? 'brightness(105%)' : 'brightness(102%)',
});

export const centerContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};
