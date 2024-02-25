import { faPatreon } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';

export default function PatreonButton() {
  // const { ipcRenderer } = window.require('electron');
  const { ipcRenderer } = window.electron;

  const handlePatreonClick = () => {
    ipcRenderer.sendMessage('open-patreon');
  };

  const patreonButtonStyles = {
    background: '#f96854',
    color: '#052d49',
    '&:hover': {
      background: '#fc523c',
    },
  };

  return (
    <Button
      sx={patreonButtonStyles}
      variant="contained"
      startIcon={<FontAwesomeIcon icon={faPatreon} />}
      onClick={handlePatreonClick}
    >
      Support Compopack on Patreon
    </Button>
  );
}
