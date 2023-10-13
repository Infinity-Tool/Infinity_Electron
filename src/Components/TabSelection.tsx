import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Tab,
  Tabs,
  TextField,
  useTheme,
} from "@mui/material";
import Loading from "./Loading";
import { useEffect, useState } from "react";

export default function TabSelection(props: any) {
  const theme = useTheme();
  const [currentTab, setCurrentTab]: any = useState("All");

  const currentSelection = props.currentSelection;
  const availableFiles = props.availableFiles;
  const onParentCheckToggle = props.onParentCheckToggle;
  const onChildCheckToggle = props.onChildCheckToggle;

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

  const onTabChange = (event: any, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      {/* Search Bar */}

      <Box>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          sx={{ width: "100%" }}
        />
      </Box>

      {availableFiles == null && <Loading />}
      <Tabs value={currentTab} onChange={onTabChange}>
        <Tab label={"All"} value={"All"} />

        {availableFiles?.map((tas: any, index: number) => (
          <Tab label={tas.name} value={tas.name} />
        ))}
      </Tabs>

      {/* <TabSelection value={"All"}>{"ALLLLLLLLL"}</TabSelection>
      {availableFiles?.map((tas: any, index: number) => (
        <TabSelection value={tas.name}>{tas.name}</TabSelection>
      ))} */}

      {/* 
      <Box sx={modListContainer}>
        {availableFiles == null && <Loading />}
        {availableFiles?.map((tas: any, index: number) => (
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
        {availableFiles == null && <div>loading...</div>}
      </Box> */}
    </>
  );
}
