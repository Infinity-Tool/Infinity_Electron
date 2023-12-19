import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
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
import { TabContext, TabPanel } from "@mui/lab";
import { cloneDeep } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { removeZ } from "Services/Utils/NameFormatterUtils";
import { useHttpContext } from "Services/http/HttpContext";
import Zoom from "react-medium-image-zoom";
import { Virtuoso } from "react-virtuoso";
import PoiInfoDialog from "./PoiInfoDialog";

export default function TabSelection(props: any) {
  const theme = useTheme();
  const [currentTab, setCurrentTab]: any = useState("All");
  const [search, setSearch]: any = useState("");
  const { baseUrl } = useHttpContext();
  const [infoDialogState, setInfoDialogState]: any = useState({
    open: false,
    poi: null,
  });

  const {
    currentSelection,
    availableFiles,
    availableTags,
    selectedTags,
    setSelectedTags,
    onToggle,
  } = props;

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
    if (event.target.value.includes("All")) {
      const newValue =
        event.target.value.length === availableTags.length + 1
          ? []
          : availableTags;
      setSelectedTags(newValue);
    } else {
      setSelectedTags(event.target.value);
    }
  };

  const FormatName = (tag: string) => {
    return tag.replace("_", " ").replace(/\w\S*/g, (txt: string) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const filteredAvailableFiles = useMemo(() => {
    const cloneFiles = cloneDeep(availableFiles);
    return cloneFiles.map((file: any) => {
      file.childSelections = file.childSelections.filter((child: any) => {
        const containsTag = child.editorGroups?.some((tag: string) => {
          return selectedTags.includes(tag);
        });

        const containsSearch = child?.name
          ?.toLowerCase()
          ?.includes(search.toLowerCase());

        return containsTag && containsSearch;
      });

      return file;
    });
  }, [availableFiles, selectedTags, search]);

  const panelFileList = useMemo(() => {
    return filteredAvailableFiles.concat({
      name: "All",
      childSelections: filteredAvailableFiles.flatMap(
        (x: any) => x.childSelections
      ),
    });
  }, [filteredAvailableFiles]);

  const availableTabs = useMemo(() => {
    const tabs = [];

    tabs.push("All");
    availableFiles?.forEach((file: any) => tabs.push(file.name));

    return tabs ?? [];
  }, [availableFiles]);

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
    mb: theme.spacing(4),
  };

  const filterStyles = {
    // make all filters the same width
    width: "100%",
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

  const tabRowstyles = { borderBottom: 1, borderColor: "divider" };

  const tagChipContainerStyles = {
    display: "flex",
    gap: theme.spacing(1),
  };

  const noResultsMessageTitleStyles = {
    color: theme.palette.text.secondary,
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
  };

  const noResultsMessageCaptionStyles = {
    color: theme.palette.text.secondary,
    fontSize: "1rem",
    textAlign: "center",
  };

  return (
    <>
      {/* Search Bar */}
      <Box sx={filterContainerStyles}>
        <TextField
          sx={filterStyles}
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          // icon at the end to clear
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {
                  setSearch("");
                }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size="sm"
                  color={theme.palette.text.secondary}
                />
              </IconButton>
            ),
          }}
        />

        {/* Tag Selection */}
        <FormControl sx={filterStyles}>
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
            {/* Select/Unselect ALL toggle */}
            <MenuItem
              value="All"
              selected={selectedTags.length >= availableTags.length}
            >
              <ListItemText primary="Select All" />
            </MenuItem>

            {availableTags
              ?.sort((a: string, b: string) =>
                a.toLowerCase().localeCompare(b.toLowerCase())
              )
              .map((tag: string, i: number) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                  <ListItemText primary={FormatName(tag)} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {filteredAvailableFiles == null && <Loading />}

      <TabContext value={currentTab}>
        {/* Tabs */}
        <Box sx={tabRowstyles}>
          <Tabs value={currentTab} onChange={onTabChange} variant="scrollable">
            {availableTabs?.map((tabName: any, index: number) => (
              <Tab label={removeZ(tabName)} value={tabName} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {panelFileList?.map((parent: any, index: number) => (
          <TabPanel value={parent.name} key={parent.name + index}>
            {parent.childSelections.length > 0
              ? SelectablePoi(parent, index)
              : DisplayNoResults()}
          </TabPanel>
        ))}
      </TabContext>

      {/* Info Popover */}
      {
        <PoiInfoDialog
          dialogState={infoDialogState}
          setDialogState={setInfoDialogState}
        />
      }
    </>
  );

  function DisplayNoResults() {
    return (
      <>
        <Typography sx={noResultsMessageTitleStyles}>
          No results found
        </Typography>
        <Typography sx={noResultsMessageCaptionStyles}>
          Try changing your search or selected tags
        </Typography>
      </>
    );
  }

  function SelectablePoi(parent: any, index: number) {
    const count = parent.childSelections.length;

    const poiStyles = (selected: boolean): any => ({
      paddingY: theme.spacing(1),
      paddingX: theme.spacing(2),
      marginY: theme.spacing(1),
      border: `1px solid ${
        selected ? theme.palette.primary.dark : theme.palette.divider
      }`,
    });

    const imageListStyles = {
      display: "flex",
      gap: theme.spacing(1),
    };

    const imageContainerStyles = {
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
      "& img": {
        maxHeight: "200px",
        maxWidth: "200px",
      },
    };

    return (
      <Virtuoso
        key={index}
        style={{ height: "400px" }}
        totalCount={count}
        itemContent={(index) => {
          const child = parent.childSelections[index];
          const selected = getIsChildSelected(parent.name, child.name);

          return (
            <Paper sx={poiStyles(selected)} key={index}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selected}
                      onClick={(e: any) => {
                        onToggle(e.target.checked, parent.name, child.name);
                      }}
                    />
                  }
                  label={removeZ(child.name)}
                ></FormControlLabel>
              </FormControl>
              <IconButton>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  color={theme.palette.text.secondary}
                  onClick={(e) => {
                    setInfoDialogState({
                      open: true,
                      poi: child,
                    });
                  }}
                />
              </IconButton>
              <Typography>{child.description}</Typography>

              <Box sx={imageListStyles}>
                {child.images?.map((img: string) => (
                  <Box sx={imageContainerStyles}>
                    <Zoom>
                      <img
                        src={baseUrl + "/" + img}
                        alt={child.name}
                        style={{ width: "100%" }}
                      ></img>
                    </Zoom>
                  </Box>
                ))}
              </Box>
              <Box sx={tagChipContainerStyles}>
                {child.editorGroups?.map((eg: string) => (
                  <Chip
                    label={FormatName(eg)}
                    size="small"
                    color={GetChipColor(eg)}
                    variant="filled"
                  ></Chip>
                ))}
              </Box>
            </Paper>
          );
        }}
      ></Virtuoso>
    );
  }
}
