import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Loading from "./Loading";
import { useMemo, useState } from "react";
import useLocalStorage from "Services/useLocalStorage";
import LocalStorageKeys from "Services/LocalStorageKeys";
import { TabContext, TabPanel } from "@mui/lab";

export default function TabSelection(props: any) {
  const theme = useTheme();
  const [currentTab, setCurrentTab]: any = useState("All");
  const [selectedTags, setSelectedTags]: any = useLocalStorage(
    LocalStorageKeys.selectedTags,
    props.availableTags
  );

  const currentSelection = props.currentSelection;
  const availableFiles = props.availableFiles;
  const availableTags = props.availableTags;
  const onToggle = props.onToggle;

  // const getIsSelected = (fileName: string): boolean => {
  //   return currentSelection.some((x: any) => x.name === fileName);
  // };

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

  const filteredAvailableFiles = useMemo(() => {
    return availableFiles.map((file: any) => {
      file.childSelections = file.childSelections.filter((child: any) => {
        return child.editorGroups?.some((tag: string) => {
          return selectedTags.includes(tag);
        });
      });

      return file;
    });
  }, [availableFiles, selectedTags]);

  const GetChipColor = (tag: string) => {
    if (selectedTags.includes(tag)) {
      return "primary";
    } else {
      return "default";
    }
  };

  // Styles
  const filterContainerStyles = {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  };

  const GetTagDropdownText = (selected: any) => {
    const selectedCount = selected.length;

    if (selectedCount === 0) {
      return "None Selected";
    } else if (selectedCount === availableTags.length) {
      return "All Selected";
    } else if (selectedCount > 2) {
      return selectedCount + " selected";
    } else {
      return selected.join(", ");
    }
  };

  const searchBarStyles = {
    minWidth: "300px",
  };
  const tagSelectorStyles = {
    minWidth: "300px",
  };
  const tabRowstyles = { borderBottom: 1, borderColor: "divider" };

  const poiStyles = {
    paddingY: theme.spacing(1),
    paddingX: theme.spacing(2),
    marginY: theme.spacing(1),
  };

  const tagChipContainerStyles = {
    display: "flex",
    gap: theme.spacing(1),
  };
  const noResultsMessageMainStyles = {
    fontSize: "1.5rem",
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

        {/* Tag Selection */}
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
            {/* TODO All Tag selection */}
            {/* <MenuItem
              value="All"
              selected={selectedTags.length >= availableTags.length}
            >
              <Checkbox
                checked={selectedTags.length >= availableTags.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTags(availableTags);
                  } else {
                    setSelectedTags([]);
                  }
                }}
              />
              <ListItemText primary="All" />
            </MenuItem> */}

            {availableTags
              ?.sort((a: string, b: string) =>
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

      {filteredAvailableFiles == null && <Loading />}

      <TabContext value={currentTab}>
        <Box sx={tabRowstyles}>
          <Tabs value={currentTab} onChange={onTabChange} variant="scrollable">
            <Tab label={"All"} value={"All"} />
            {filteredAvailableFiles?.map((tas: any, index: number) => (
              <Tab label={tas.name} value={tas.name} />
            ))}
          </Tabs>
        </Box>
        {filteredAvailableFiles?.map((parent: any, index: number) => (
          <TabPanel value={parent.name} key={parent.name + index}>
            {SelectablePois(parent)}
          </TabPanel>
        )) || DisplayNoResults()}
        <TabPanel value={"All"}>
          {filteredAvailableFiles?.map((parent: any, index: number) =>
            SelectablePois(parent)
          ) || DisplayNoResults()}
        </TabPanel>
      </TabContext>
    </>
  );

  function DisplayNoResults() {
    return !filteredAvailableFiles
      ?.map((x: any) => x.childSelections)
      ?.some() ? (
      <>
        <Typography sx={noResultsMessageMainStyles}>
          No results found!
        </Typography>
        <Typography variant="caption">
          Try changing your search or selected tags
        </Typography>
      </>
    ) : (
      <></>
    );
  }

  function SelectablePois(parent: any) {
    return (
      <Box>
        {parent.childSelections?.length > 0 &&
          parent.childSelections.map((child: any, index: number) => (
            <Paper sx={poiStyles} key={index}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getIsChildSelected(parent.name, child.name)}
                      onClick={(e: any) => {
                        onToggle(e.target.checked, parent.name, child.name);
                      }}
                    />
                  }
                  label={child.name}
                ></FormControlLabel>
              </FormControl>
              <Box sx={tagChipContainerStyles}>
                {child.editorGroups?.map((eg: string) => (
                  <Chip
                    label={formatName(eg)}
                    size="small"
                    color={GetChipColor(eg)}
                  ></Chip>
                ))}
              </Box>
            </Paper>
          ))}
      </Box>
    );
  }
}
