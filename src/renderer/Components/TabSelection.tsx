import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  ImageList,
  ImageListItem,
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
} from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import Loading from './Loading';
import { useMemo, useState } from 'react';
import { TabContext, TabPanel } from '@mui/lab';
import { cloneDeep } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Virtuoso } from 'react-virtuoso';
import PoiInfoDialog from './PoiInfoDialog';
import { useHttpContext } from '../Services/http/HttpContext';
import { ProperCase, RemoveZ } from '../Services/utils/NameFormatterUtils';
import { poiStyles } from '../Services/CommonStyles';

export default function TabSelection(props: any) {
  const theme = useTheme();
  const [currentTab, setCurrentTab]: any = useState('All');
  const [search, setSearch]: any = useState('');
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
    selectAll,
  } = props;

  const getIsChildSelected = (
    parentFileName: string,
    childFileName: string,
  ): boolean => {
    const parentIndex = currentSelection.findIndex(
      (x: any) => x.name === parentFileName,
    );
    if (parentIndex === -1) return false;
    const childIndex = currentSelection[parentIndex]?.childSelections.findIndex(
      (x: any) => x === childFileName,
    );
    return childIndex > -1;
  };

  const onTabChange = (event: any, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleSelectedTagChange = (event: any) => {
    if (event.target.value.includes('All')) {
      const newValue =
        event.target.value.length === availableTags.length + 1
          ? []
          : availableTags;
      setSelectedTags(newValue);
    } else {
      setSelectedTags(event.target.value);
    }
  };

  const filteredAvailableFiles = useMemo(() => {
    const cloneFiles = cloneDeep(availableFiles);
    return cloneFiles.map((file: any) => {
      file.childSelections = file.childSelections
        .filter((child: any) => {
          const containsTag = child.editorGroups?.some((tag: string) => {
            return selectedTags.includes(tag);
          });

          const containsSearch = child?.name
            ?.toLowerCase()
            ?.includes(search.toLowerCase());

          return containsTag && containsSearch;
        })
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
      return file;
    });
  }, [availableFiles, selectedTags, search]);

  const panelFileList = useMemo(() => {
    const tabs: TabContent[] = filteredAvailableFiles.map((category: any) => ({
      tabName: category.name,
      parentName: category.name,
      tabFiles: category.childSelections.map((file: any) => ({
        parent: category.name,
        ...file,
      })),
    }));

    // concat "All" tab which is all files
    tabs.push({
      tabName: 'All',
      parentName: null,
      tabFiles: filteredAvailableFiles.flatMap((x: any) =>
        x.childSelections.map((file: any) => ({
          parent: x.name,
          ...file,
        })),
      ),
    });

    return tabs;
  }, [filteredAvailableFiles]);

  const availableTabs = useMemo(() => {
    const tabs = availableFiles
      ?.filter(
        (file: any) => file.name.toLowerCase() !== '_Required'.toLowerCase(),
      )
      .map((file: any) => file.name)
      .sort();

    // concat "All" tab which is all files to the begingging of the array
    tabs.unshift('All');

    return tabs;
  }, [availableFiles]);

  const GetChipVariant = (selected: boolean) => {
    return selected ? 'filled' : 'outlined';
  };

  // Styles
  const filterContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    mb: theme.spacing(4),
  };

  const filterStyles = {
    // make all filters the same width
    width: '100%',
  };

  const GetTagDropdownText = (selected: any) => {
    const selectedCount = selected.length;

    if (selectedCount === 0) {
      return 'None Selected';
    } else if (selectedCount === availableTags.length) {
      return 'All Selected';
    } else if (selectedCount > 2) {
      return `${selectedCount} selected`;
    } else {
      return selected.join(', ');
    }
  };

  const tabRowstyles = { borderBottom: 1, borderColor: 'divider' };

  const tagChipContainerStyles = {
    display: 'flex',
    gap: theme.spacing(0.5),
  };

  const noResultsMessageTitleStyles = {
    color: theme.palette.text.secondary,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const noResultsMessageCaptionStyles = {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    textAlign: 'center',
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
                  setSearch('');
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
                a.toLowerCase().localeCompare(b.toLowerCase()),
              )
              .map((tag: string, i: number) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                  <ListItemText primary={ProperCase(tag)} />
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
              <Tab label={RemoveZ(tabName)} value={tabName} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {panelFileList?.map((tabContent: TabContent, index: number) => (
          <TabPanel
            value={tabContent.tabName}
            key={tabContent.tabName}
            sx={{ height: '100%' }}
          >
            {tabContent?.parentName && (
              <Button
                onClick={() => {
                  const parentName = tabContent.parentName;
                  selectAll(parentName);
                }}
              >
                Select All
              </Button>
            )}
            {tabContent.tabFiles.length > 0
              ? VirtualTabFileList(tabContent.tabFiles, index)
              : DisplayNoResults()}
          </TabPanel>
        ))}
        {/* <TabPanel value={'All'} sx={{ height: '100%' }}></TabPanel> */}
      </TabContext>

      {/* Info Popover */}
      <PoiInfoDialog
        dialogState={infoDialogState}
        setDialogState={setInfoDialogState}
      />
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

  function VirtualTabFileList(tabFiles: TabFile[], index: number) {
    const count = tabFiles.length;
    const poiInfoStyles = {
      maxWidth: '66%',
    };

    return (
      <Virtuoso
        key={index}
        style={{ height: '100%' }}
        totalCount={count}
        itemContent={(index) => {
          const tabFile: TabFile = tabFiles[index];
          const selected = getIsChildSelected(tabFile.parent, tabFile.name);

          return (
            <Paper sx={poiStyles(theme, selected)} key={index}>
              <Box sx={poiInfoStyles}>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selected}
                        onClick={(e: any) => {
                          onToggle(
                            e.target.checked,
                            tabFile.parent,
                            tabFile.name,
                          );
                        }}
                      />
                    }
                    label={RemoveZ(tabFile.name)}
                  ></FormControlLabel>
                </FormControl>
                <IconButton
                  onClick={(e) => {
                    setInfoDialogState({
                      open: true,
                      poi: tabFile,
                    });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color={theme.palette.text.secondary}
                  />
                </IconButton>
                <Typography>{tabFile.description}</Typography>
                <Box sx={tagChipContainerStyles}>
                  {tabFile.editorGroups?.map((eg: string) => (
                    <Chip
                      label={ProperCase(eg)}
                      size="small"
                      color="default"
                      variant={GetChipVariant(selectedTags.includes(eg))}
                    ></Chip>
                  ))}
                </Box>
              </Box>
              <ImageList rowHeight={100} cols={100}>
                {tabFile.images?.map((img: string) => (
                  <ImageListItem>
                    <Zoom>
                      <img
                        src={`${baseUrl}/${img}`}
                        alt={tabFile.name}
                        style={{ maxHeight: '90px' }}
                        loading="lazy"
                      ></img>
                    </Zoom>
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          );
        }}
      ></Virtuoso>
    );
  }
}
