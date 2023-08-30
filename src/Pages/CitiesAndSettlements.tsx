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

export interface IUserSelection {
  name: string;
  childSelections: string[];
}

export default function CitiesAndSettlements() {
  const router = useNavigate();
  const theme = useTheme();
  const [, setHost] = useLocalStorage(LocalStorageKeys.host, null);
  const [selectionAvailable, setSelectionAvailable]: any = useState();
  const [currentSelection, setCurrentSelection] = useLocalStorage(
    LocalStorageKeys.selectedMods,
    []
  );

  //Effects
  useEffect(() => {
    GetDirectoryFileHttp().then((res) => {
      setHost(res.host);
      console.log("res", res);
      setSelectionAvailable(res.step_1);
    });
  }, []);

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.options);
  };
  const onNextClick = async () => {
    // await ConfigureSelectedFiles();
    router(AppRoutes.bigStructures);
  };

  const onParentCheckToggle = (checked: boolean, fileName: string) => {
    console.log("checked", checked, "fileName", fileName);
    if (checked) {
      const newSelection = [...currentSelection];
      newSelection.push({ name: fileName, childSelections: [] });
      setCurrentSelection(newSelection);
    } else {
      setCurrentSelection((prev: any) => {
        return prev.filter((x: any) => x.name !== fileName);
      });
    }
  };

  const onChildCheckToggle = (
    checked: boolean,
    parentFileName: string,
    childFileName: string
  ) => {
    if (checked) {
      const newSelection = [...currentSelection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName
      );
      if (index > -1) {
        newSelection[index].childSelections.push(childFileName);
      }
      setCurrentSelection(newSelection);
    } else {
      const newSelection = [...currentSelection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName
      );
      if (index > -1) {
        newSelection[index].childSelections = newSelection[
          index
        ].childSelections.filter((x: any) => x !== childFileName);
      }
      setCurrentSelection(newSelection);
    }
  };

  const getIsSelected = (fileName: string): boolean => {
    return currentSelection.some((x: any) => x.name === fileName);
  };

  const getIsChildSelected = (
    parentFileName: string,
    childFileName: string
  ): boolean => {
    const parentIndex = currentSelection.findIndex(
      (x: any) => x.name === parentFileName
    );
    if (parentIndex === -1) return false;
    const childIndex = currentSelection[parentIndex]?.childSelections.findIndex(
      (x: any) => x === childFileName
    );
    return childIndex > -1;
  };

  //Styles
  const modListContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };
  const getModListItemStyles = (file: string) => {
    const isSelected = getIsSelected(file);
    return {
      padding: "1rem",
      border: isSelected
        ? `1px solid ${theme.palette.primary.dark}`
        : "1px solid transparent",
      // transform: isSelected ? "" : "scale(.96)",
      // transition: "all .3s ease-in-out",
    };
  };
  const childContainerStyles = {
    paddingLeft: "2rem",
  };

  console.log("[SELECTION]", currentSelection);

  return (
    <Box sx={pageContainerStyles}>
      {/* <Button onClick={ConfigureSelectedFiles}>Test (delete me)</Button> */}
      <Box sx={pageContentStyles}>
        <Button onClick={() => setCurrentSelection([])}>Clear Selection</Button>
        <Typography variant="h1">Cities & Settlements</Typography>
        <Box sx={modListContainer}>
          {selectionAvailable == null && <Loading />}
          {selectionAvailable?.map((tas: any, index: number) => (
            <Paper sx={getModListItemStyles(tas.name)} key={index}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getIsSelected(tas.name)}
                      onClick={(e: any) =>
                        onParentCheckToggle(e.target.checked, tas.name)
                      }
                    />
                  }
                  label={tas.name}
                ></FormControlLabel>
              </FormControl>

              <Box sx={childContainerStyles}>
                {tas.childSelections?.length > 0 &&
                  tas.childSelections.map((child: any) => (
                    <Box>
                      <FormControl>
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={!getIsSelected(tas.name)}
                              checked={getIsChildSelected(tas.name, child.name)}
                              onClick={(e: any) =>
                                onChildCheckToggle(
                                  e.target.checked,
                                  tas.name,
                                  child.name
                                )
                              }
                            />
                          }
                          label={child.name}
                        ></FormControlLabel>
                      </FormControl>
                    </Box>
                  ))}
              </Box>
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
          disabled={currentSelection.length === 0}
        >
          Download & Install
        </Button>
      </Box>
    </Box>
  );
}
