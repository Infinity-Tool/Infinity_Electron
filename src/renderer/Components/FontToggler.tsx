import { IconButton, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faMoon,
  faSun,
  faTextHeight,
} from '@fortawesome/free-solid-svg-icons';
import { useInfinityThemeContext } from '../Services/theme/ThemeContext';

export default function FontToggler() {
  const { themeMode, toggleFontSize } = useInfinityThemeContext();
  const theme = useTheme();

  const themeTogglerButtonStyles = {
    color: theme.palette.text.secondary,
  };

  return (
    <IconButton onClick={toggleFontSize}>
      <FontAwesomeIcon
        size="sm"
        style={themeTogglerButtonStyles}
        icon={faTextHeight}
      />
    </IconButton>
  );
}
