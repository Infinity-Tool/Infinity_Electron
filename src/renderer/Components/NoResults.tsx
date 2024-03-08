import { Typography, useTheme } from '@mui/material';

export default function NoResults() {
  const theme = useTheme();

  const noResultsMessageTitleStyles = {
    color: theme.palette.text.secondary,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const noResultsMessageCaptionStyles = {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    textAlign: 'center',
  };

  return (
    <>
      <Typography sx={noResultsMessageTitleStyles}>No results found</Typography>
      <Typography sx={noResultsMessageCaptionStyles}>
        Try changing your search or selected tags
      </Typography>
    </>
  );
}
