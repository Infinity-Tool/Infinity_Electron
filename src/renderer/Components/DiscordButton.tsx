import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';

export default function DiscordButton() {
  // const { ipcRenderer } = window.require('electron');
  const { ipcRenderer } = window.electron;

  const handleDiscordClick = () => {
    ipcRenderer.sendMessage('open-discord');
  };

  const discordButtonStyles = {
    background: '#5865F2',
    color: 'white',
    '&:hover': {
      background: '#3c4cfc',
    },
  };

  return (
    <Button
      variant="contained"
      startIcon={<FontAwesomeIcon icon={faDiscord} />}
      onClick={handleDiscordClick}
      sx={discordButtonStyles}
    >
      Join our Discord
    </Button>
  );
}
