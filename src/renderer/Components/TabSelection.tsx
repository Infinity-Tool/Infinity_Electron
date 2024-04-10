/* eslint-disable no-else-return */
/* eslint-disable prettier/prettier */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  useTheme,
} from '@mui/material';
import Loading from './Loading';
import { useMemo, useState } from 'react';
import { TabContext, TabPanel } from '@mui/lab';
import { cloneDeep } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PoiInfoDialog from './PoiInfoDialog';
import { ProperCase, RemoveZ } from '../Services/utils/NameFormatterUtils';
import { TRADER_TAG } from '../Services/Constants';
import NoResults from './NoResults';
import VirtualTabFileList from './VirtualPoiList';

export default function TabSelection(props: any) {
  const theme = useTheme();
  const [currentTab, setCurrentTab]: any = useState('All');
  const [search, setSearch]: any = useState('');
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
    selectAll,
    excludeTraders,
    moddedInstall,
    onToggle,
  } = props;

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
          // Selected tags
          const containsTag = child.editorGroups?.some((tag: string) => {
            return selectedTags.includes(tag);
          });

          // Exclude Traders
          if (
            excludeTraders &&
            child.editorGroups?.some((tag: string) =>
              tag.toLowerCase().includes(TRADER_TAG(moddedInstall)),
            )
          ) {
            return false;
          }

          // Search bar
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
      tabFiles: filteredAvailableFiles
        .flatMap((x: any) =>
          x.childSelections.map((file: any) => ({
            parent: x.name,
            ...file,
          })),
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name)),
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

  // Styles
  const filterContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    mb: theme.spacing(4),
  };

  const filterStyles = {
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

  const tabPanelStyles = {
    p: 0,
    height: '100%',
  };
  const selectAllButtonHeight = '40px';
  const selectAllButtonStyles = {
    height: selectAllButtonHeight,
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
              <Tab key={tabName} label={RemoveZ(tabName)} value={tabName} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {panelFileList?.map((tabContent: TabContent) => (
          <TabPanel
            value={tabContent.tabName}
            key={tabContent.tabName}
            sx={tabPanelStyles}
          >
            {tabContent?.parentName && (
              <Button
                onClick={() => {
                  const { parentName } = tabContent;
                  selectAll(parentName);
                }}
                sx={selectAllButtonStyles}
              >
                Select All
              </Button>
            )}
            <Paper sx={{ height: `calc(100% - ${selectAllButtonHeight})` }}>
              <List sx={{ height: '100%' }}>
                {tabContent.tabFiles.length > 0 ? (
                  <VirtualTabFileList
                    key={tabContent.tabName}
                    tabFiles={tabContent.tabFiles}
                    selection={currentSelection}
                    onToggle={onToggle}
                    setInfoDialogState={setInfoDialogState}
                    selectedTags={selectedTags}
                  />
                ) : (
                  <NoResults />
                )}
              </List>
            </Paper>
          </TabPanel>
        ))}
      </TabContext>

      {/* Info Popover */}
      <PoiInfoDialog
        dialogState={infoDialogState}
        setDialogState={setInfoDialogState}
      />
    </>
  );
}
