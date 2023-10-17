import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
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
  const [selectedTags, setSelectedTags]: any = useState(props.availableTags);

  const currentSelection = props.currentSelection;
  const availableFiles = props.availableFiles;
  const onParentCheckToggle = props.onParentCheckToggle;
  const onChildCheckToggle = props.onChildCheckToggle;
  const availableTags = props.availableTags;

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

  const handleSelectedTagChange = (event: any) => {
    setSelectedTags(event.target.value);
  };

  const formatName = (tag: string) => {
    return tag.replace("_", " ").replace(/\w\S*/g, (txt: string) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Styles
  const filterContainerStyles = {
    display: "flex",
    alignItems: "center",
    //wrap

    gap: theme.spacing(2),
  };

  const GetTagDropdownText = (selected: any) => {
    if (selected.length > 2) {
      return selected.length + " selected";
    }

    return selected.join(", ");
  };

  const searchBarStyles = {
    minWidth: "300px",
  };
  const tagSelectorStyles = {
    minWidth: "300px",
  };

  return (
    <>
      {/* Search Bar */}
      <Box sx={filterContainerStyles}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          sx={searchBarStyles}
        />

        <FormControl sx={tagSelectorStyles}>
          <InputLabel id="tag-selection">Editor Groups</InputLabel>
          <Select
            labelId="tag-selection"
            id="demo-multiple-checkbox"
            multiple
            value={selectedTags}
            onChange={handleSelectedTagChange}
            input={<OutlinedInput label="Editor Groups" />}
            renderValue={GetTagDropdownText}
          >
            {availableTags
              .sort((a: string, b: string) =>
                a.toLowerCase().localeCompare(b.toLowerCase())
              )
              .map((tag: string, i: number) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                  <ListItemText primary={formatName(tag)} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {availableFiles == null && <Loading />}
      <Tabs value={currentTab} onChange={onTabChange} variant="scrollable">
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
