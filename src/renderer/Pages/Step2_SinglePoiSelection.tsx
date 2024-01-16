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
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import Loading from '../Components/Loading';
import Error from '../Components/Error';
import { useSelectionContext } from '../Services/SelectionContext';

export interface IUserSelection {
  name: string;
  childSelections: string[];
}

export default function StandalonePois() {
  const router = useNavigate();
  const directoryQuery = GetDirectoryFileQuery();
  const {
    step2Selection,
    setStep2Selection,
    step2SelectedTags,
    setStep2SelectedTags,
  } = useSelectionContext();
  const availableFiles = directoryQuery.data?.step_2;
  const availableTags = directoryQuery.data?.editorGroups;

  // TODO put logic into query when SelectionContext is implemented
  useEffect(() => {
    if (directoryQuery.isSuccess) {
      setStep2Selection((prev: any) => {
        return prev != null
          ? prev
          : directoryQuery.data.step_2.map((x: any) => ({
              name: x.name,
              childSelections: x.childSelections.map((y: any) => y.name),
            }));
      });
      setStep2SelectedTags((prev: any) => {
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
    const parentIndex = step2Selection.findIndex((x: any) => x.name === parent);
    // checked
    if (checked) {
      // check if parent is in current selection, if so add child to it
      if (parentIndex > -1) {
        const newSelection = [...step2Selection];
        newSelection[parentIndex].childSelections.push(child);
        setStep2Selection(newSelection);
      } else {
        // if not, add parent to current selection with child
        const newSelection = [...step2Selection];
        newSelection.push({ name: parent, childSelections: [child] });
        setStep2Selection(newSelection);
      }
    }
    // unchecked
    else {
      // check if parent is in current selection, but now has no children, if so remove it
      if (parentIndex > -1) {
        const newSelection = [...step2Selection];
        newSelection[parentIndex].childSelections = newSelection[
          parentIndex
        ].childSelections.filter((x: any) => x !== child);
        if (newSelection[parentIndex].childSelections.length === 0) {
          newSelection.splice(parentIndex, 1);
        }
        setStep2Selection(newSelection);
      }
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={headerContainerStyles}>
          <Typography variant="h1">Single POI Selection</Typography>
          <Button onClick={() => setStep2Selection([])}>Clear Selection</Button>
        </Box>

        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isError && (
          <Error message={'There was a problem loading the list of mods.'} />
        )}

        {availableFiles && availableTags && (
          <TabSelection
            currentSelection={step2Selection}
            availableFiles={availableFiles}
            onToggle={onToggle}
            availableTags={availableTags}
            selectedTags={step2SelectedTags}
            setSelectedTags={setStep2SelectedTags}
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
