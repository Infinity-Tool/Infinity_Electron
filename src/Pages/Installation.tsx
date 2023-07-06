import { Typography } from "@mui/material";
import LocalStorageKeys from "Services/LocalStorageKeys";
import useLocalStorage from "Services/useLocalStorage";

export default function Installation() {
  const [selectedMods, setSelectedMods] = useLocalStorage(
    LocalStorageKeys.selectedMods,
    []
  );

  return <Typography>installation happening here 🪄🔮</Typography>;
}
