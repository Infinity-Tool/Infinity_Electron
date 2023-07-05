import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { buttonContainerStyles } from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import LocalStorageKeys from "Services/LocalStorageKeys";
import { GetDirectoryFileHttp } from "Services/http/Directory";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Selection() {
  const router = useNavigate();
  const [directoryFile, setDirectoryFile]: any = useState();
  const [selectedMods, setSelectedMods] = useLocalStorage(
    LocalStorageKeys.selectedMods,
    []
  );

  useEffect(() => {
    GetDirectoryFileHttp().then((res) => {
      console.log("res", res);
      setDirectoryFile(res);
    });
  }, []);

  //Functions
  const onBackClick = () => {
    router(AppRoutes.options);
  };
  const onNextClick = () => {
    //TODO
  };

  //Styles
  const modListContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };
  const modContainer = {
    padding: "1rem",
  };

  return (
    <>
      <Box sx={modListContainer}>
        {directoryFile?.map((tas: any) => (
          <Paper sx={modContainer}>
            <FormControl>
              <FormControlLabel
                control={<Checkbox />}
                label={tas.name}
              ></FormControlLabel>
            </FormControl>
          </Paper>
        ))}
        {directoryFile == null && <div>loading...</div>}
      </Box>
      <Box sx={buttonContainerStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button variant="contained" onClick={onNextClick}>
          Download & Install
        </Button>
      </Box>
    </>
  );
}
