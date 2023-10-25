import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";

export default function Discord() {
  const handleDiscordClick = () => {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("open-discord");
  };

  return (
    <IconButton onClick={handleDiscordClick}>
      <FontAwesomeIcon icon={faDiscord} />
    </IconButton>
  );
}
