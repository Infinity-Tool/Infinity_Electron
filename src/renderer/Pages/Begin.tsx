import { Box, Button, Input, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Begin() {
  // shell.showItemInFolder('filepath') // Show the given file in a file manager. If possible, select the file.
  // shell.openPath('folderpath') // Open the given file in the desktop's default manner.

  const getDefaultFilePath = () => {
    //Windows:
    return 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\7 Days To Die\\Data\\Prefabs';
  };

  const router = useNavigate();
  const [prefabFolder, setPrefabFolder] = useState(getDefaultFilePath);

  const [done, setDone] = useState(false);

  const getFileHttp = () =>
    fetch(
      'https://infinity-tool.github.io/Infinity_Assets/Compopack/Compopack48%20Asia%20Town/CP%20Asia/CP%20Asia%20Parts/part_xcostum_aloe_10x5.blocks.nim'
    )
      .then((response) => response.json())
      .then((data) => setDone(true));
  // const getFileHttpQuery = useQuery();

  // Functions
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

  return (
    <div>
      <h1>Begin</h1>

      <Box>
        <Typography></Typography>
        <TextField
          label="Prefab Folder"
          defaultValue={getDefaultFilePath}
          sx={inputStyles}
        />
      </Box>

      <Button onClick={getFileHttp}>Fetch</Button>
      <Button>Download</Button>

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
