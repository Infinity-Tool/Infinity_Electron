import { Box, IconButton, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useInfinityThemeContext } from '../Services/theme/ThemeContext';

export default function ThemeToggler() {
  const { themeMode, toggleTheme } = useInfinityThemeContext();
  const theme = useTheme();

  const buttonContainerStyles = {
    m: theme.spacing(1),
  };
  const themeTogglerButtonStyles = {
    color: theme.palette.text.secondary,
  };

  return (
    <Box sx={buttonContainerStyles}>
      <IconButton onClick={toggleTheme}>
        <FontAwesomeIcon
          style={themeTogglerButtonStyles}
          icon={themeMode == 'dark' ? faSun : faMoon}
        />
      </IconButton>
    </Box>
  );
}
