import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import LocalStorageKeys from "Services/LocalStorageKeys";
import useLocalStorage from "Services/useLocalStorage";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Installation() {
  const router = useNavigate();
  const [cancelled, setCancelled] = useState(false);
  const [selectedMods, setSelectedMods] = useLocalStorage(
    LocalStorageKeys.selectedMods,
    []
  );

  const [cleanInstall, setCleanInstall] = useLocalStorage(
    LocalStorageKeys.cleanInstall,
    false
  );

  const [testFiles, setTestFiles] = useState<any>([]);

  //Functions
  const onRestartClick = () => {
    router(AppRoutes.welcome);
  };
  const onCancelClick = () => {
    setCancelled(true);
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        {!cancelled && (
          <>
            <CircularProgress />
          </>
        )}

        {cancelled && (
          <Box>
            <Typography>Download canceled! ☹️</Typography>
            <Button onClick={onRestartClick}>Return to start</Button>
          </Box>
        )}
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onCancelClick}>Cancel</Button>
      </Box>
    </Box>
  );
}
