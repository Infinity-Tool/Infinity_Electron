import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabSelection from '../Components/TabSelection';
import {
  pageContainerStyles,
  pageContentStyles,
  headerContainerStyles,
  pageFooterStyles,
} from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import StorageKeys from '../Services/StorageKeys';
import useLocalStorage from '../Services/useLocalStorage';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import Loading from '../Components/Loading';
import Error from '../Components/Error';

export interface IUserSelection {
  name: string;
  childSelections: string[];
}

export default function StandalonePois() {
  const router = useNavigate();
  const directoryQuery = GetDirectoryFileQuery();
  const availableFiles = directoryQuery.data?.step_2;
  const availableTags = directoryQuery.data?.editorGroups;

  const [currentSelection, setCurrentSelection] = useLocalStorage(
    StorageKeys.step2Selection,
    null,
  );
  const [selectedTags, setSelectedTags]: any = useLocalStorage(
    StorageKeys.selectedTags,
    [],
  );

  // TODO put logic into query when SelectionContext is implemented
  useEffect(() => {
    if (directoryQuery.isSuccess) {
      setCurrentSelection((prev: any) => {
        return prev != null
          ? prev
          : directoryQuery.data.step_2.map((x: any) => ({
              name: x.name,
              childSelections: x.childSelections.map((y: any) => y.name),
            }));
      });
      setSelectedTags((prev: any) => {
        return prev.length > 0 ? prev : directoryQuery.data.editorGroups;
      });
    }
  }, [directoryQuery.isSuccess]);

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.citiesAndSettlements);
  };
  const onNextClick = async () => {
    router(AppRoutes.optionalMods);
  };

  const onToggle = (checked: boolean, parent: string, child: string) => {
    const parentIndex = currentSelection.findIndex(
      (x: any) => x.name === parent,
    );
    // checked
    if (checked) {
      // check if parent is in current selection, if so add child to it
      if (parentIndex > -1) {
        const newSelection = [...currentSelection];
        newSelection[parentIndex].childSelections.push(child);
        setCurrentSelection(newSelection);
      } else {
        // if not, add parent to current selection with child
        const newSelection = [...currentSelection];
        newSelection.push({ name: parent, childSelections: [child] });
        setCurrentSelection(newSelection);
      }
    }
    // unchecked
    else {
      // check if parent is in current selection, but now has no children, if so remove it
      if (parentIndex > -1) {
        const newSelection = [...currentSelection];
        newSelection[parentIndex].childSelections = newSelection[
          parentIndex
        ].childSelections.filter((x: any) => x !== child);
        if (newSelection[parentIndex].childSelections.length === 0) {
          newSelection.splice(parentIndex, 1);
        }
        setCurrentSelection(newSelection);
      }
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={headerContainerStyles}>
          <Typography variant="h1">Single POI Selection</Typography>
          <Button onClick={() => setCurrentSelection([])}>
            Clear Selection
          </Button>
        </Box>

        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isError && (
          <Error message={'There was a problem loading the list of mods.'} />
        )}

        {availableFiles && availableTags && (
          <TabSelection
            currentSelection={currentSelection}
            availableFiles={availableFiles}
            onToggle={onToggle}
            availableTags={availableTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        )}
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button variant="contained" onClick={onNextClick}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
