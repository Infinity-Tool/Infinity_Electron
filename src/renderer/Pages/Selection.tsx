import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfinityAssetsPath } from 'renderer/Constants';
import useLocalStorage from 'renderer/Services/useLocalStorage';

export default function Selection() {
  const defaultAppDataPath = '%APPDATA%\\7DaysToDie';
  const router = useNavigate();

  const [directoryFile, setDirectoryFile]: any = useState();
  const [filePath, setFilePath] = useLocalStorage(
    'appdataPath',
    defaultAppDataPath
  );

  // Functions
  const tryAccessFilePathElection = () => {
    //Check if folder exists using OS file system
    //If it does, set the file path
    //If it doesn't, set the file path to default
  };
  const fetchDirectory = () => {
    fetch(`${InfinityAssetsPath}/directory.json`).then((response) => {
      response.json().then((data) => {
        setDirectoryFile(data);
      });
    });
  };

  const handleBack = () => {
    router('/');
  };

  // Styles
  const buttonContainerStyles = {
    justifyContent: 'space-between',
  };

  const inputStyles = {
    width: '100%',
  };

  const ptContainer = {
    p: '1rem',
    m: '1rem',
  };

  const ptHeader = {
    fontSize: '1.5rem',
  };

  return (
    <div>
      <h1>Begin</h1>

      <Box>
        <TextField
          label="Prefab Folder"
          defaultValue={filePath}
          sx={inputStyles}
        />
      </Box>

      <Button onClick={fetchDirectory}>Fetch directory file</Button>
      {directoryFile?.map((pt: any) => (
        <Paper sx={ptContainer}>
          <Typography sx={ptHeader}>{pt.name}</Typography>
          <Typography>
            Number of poi tilesets: {pt.poi_tilesets?.length ?? 0}
          </Typography>
        </Paper>
      ))}

      <Box sx={buttonContainerStyles}>
        <Button color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </div>
  );
}
