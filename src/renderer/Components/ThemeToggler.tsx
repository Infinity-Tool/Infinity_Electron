import { IconButton, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useInfinityThemeContext } from '../Services/theme/ThemeContext';

export default function ThemeToggler() {
  const { themeMode, toggleTheme } = useInfinityThemeContext();
  const theme = useTheme();

  const themeTogglerButtonStyles = {
    color: theme.palette.text.secondary,
  };

  return (
    <IconButton onClick={toggleTheme}>
      <FontAwesomeIcon
        style={themeTogglerButtonStyles}
        icon={themeMode == 'dark' ? faSun : faMoon}
      />
    </IconButton>
  );
}
