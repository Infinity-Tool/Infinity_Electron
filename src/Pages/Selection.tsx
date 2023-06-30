import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { buttonContainerStyles } from "Services/CommonStyles";
import { routes } from "Services/Constants";
import { GetDirectoryFileHttp } from "Services/http/Directory";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Selection() {
  const router = useNavigate();
  const [directoryFile, setDirectoryFile]: any = useState();
  const [selectedMods, setSelectedMods] = useState<any>([]);

  useEffect(() => {
    GetDirectoryFileHttp().then((res) => {
      console.log("res", res);
      setDirectoryFile(res);
    });
  }, []);

  //Functions
  const onBackClick = () => {
    router(routes.options);
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
