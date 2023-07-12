import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import Loading from "Components/Loading";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import LocalStorageKeys from "Services/LocalStorageKeys";
import { GetDirectoryFileHttp } from "Services/http/Directory";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Selection() {
  const router = useNavigate();
  const theme = useTheme();
  const [, setHost] = useLocalStorage(LocalStorageKeys.host, null);
  const [selectionAvailable, setSelectionAvailable]: any = useState();
  const [selectedMods, setSelectedMods] = useLocalStorage(
    LocalStorageKeys.selectedMods,
    []
  );
  const [modFiles, setModFiles] = useLocalStorage(
    LocalStorageKeys.modFiles,
    []
  );
  const [localPrefabFiles, setLocalPrefabFiles] = useLocalStorage(
    LocalStorageKeys.localPrefabFiles,
    []
  );

  useEffect(() => {
    GetDirectoryFileHttp().then((res) => {
      setHost(res.host);
      setSelectionAvailable(res.selection);
    });
  }, []);

  //Functions
  const onBackClick = () => {
    router(AppRoutes.options);
  };
  const onNextClick = async () => {
    // await ConfigureSelectedFiles();
    router(AppRoutes.installation);
  };
  // const ConfigureSelectedFiles = async () => {
  //   console.log("selectionAvailable", selectionAvailable);
  //   console.log("selectedMods", selectedMods);
  //   console.log("modFiles", modFiles);
  //   console.log("localPrefabFiles", localPrefabFiles);

  //   selectionAvailable.forEach((tas: any) => {
  //     if (selectedMods.includes(tas.directory)) {
  //       tas.mods.forEach((mod: any) => {
  //         setModFiles([...selectedMods, mod]);
  //       });
  //       tas.localPrefabs.forEach((prefab: any) => {
  //         setLocalPrefabFiles([...selectedMods, prefab]);
  //       });
  //     }
  //   });

  //   console.log("modFiles", modFiles);
  //   console.log("localPrefabFiles", localPrefabFiles);
  // };

  //Styles
  const modListContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };
  const getModListItemStyles = (directory: string) => {
    const isSelected = selectedMods.includes(directory);
    return {
      padding: "1rem",
      border: isSelected ? `1px solid ${theme.palette.primary.dark}` : "",
      // transform: isSelected ? "" : "scale(.96)",
      // transition: "all .3s ease-in-out",
    };
  };
  console.log("selectedMods", selectedMods);
  console.log("modFiles", modFiles);
  console.log("localPrefabFiles", localPrefabFiles);

  return (
    <Box sx={pageContainerStyles}>
      {/* <Button onClick={ConfigureSelectedFiles}>Test (delete me)</Button> */}

      <Box sx={pageContentStyles}>
        <Box sx={modListContainer}>
          {selectionAvailable == null && <Loading />}
          {selectionAvailable?.map((tas: any) => (
            <Paper sx={getModListItemStyles(tas.directory)}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedMods.includes(tas.directory)}
                      onClick={(e: any) => {
                        if (e.target.checked) {
                          setSelectedMods([...selectedMods, tas.directory]);
                          setModFiles([...modFiles, ...tas.mods]);
                          setLocalPrefabFiles([
                            ...localPrefabFiles,
                            ...tas.localPrefabs,
                          ]);
                        } else {
                          setSelectedMods(
                            selectedMods.filter((x: any) => x !== tas.directory)
                          );
                          setModFiles(
                            modFiles.filter((x: any) => !tas.mods.includes(x))
                          );
                          setLocalPrefabFiles(
                            localPrefabFiles.filter(
                              (x: any) => !tas.localPrefabs.includes(x)
                            )
                          );
                        }
                      }}
                    />
                  }
                  label={tas.name}
                ></FormControlLabel>
              </FormControl>
              <Typography>
                {tas.mods.length + tas.localPrefabs.length} files
              </Typography>
            </Paper>
          ))}
          {selectionAvailable == null && <div>loading...</div>}
        </Box>
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button
          variant="contained"
          onClick={onNextClick}
          disabled={selectedMods.length === 0}
        >
          Download & Install
        </Button>
      </Box>
    </Box>
  );
}
