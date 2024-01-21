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

export default function Step4_VanillaPois() {
  const router = useNavigate();
  const directoryQuery = GetDirectoryFileQuery();
  const {
    step4Selection,
    setStep4Selection,
    step4SelectedTags,
    setStep4SelectedTags,
  } = useSelectionContext();
  const availableFiles = directoryQuery.data?.step_4;
  const availableTags = directoryQuery.data?.step_4_tags;

  // TODO put logic into query when SelectionContext is implemented
  useEffect(() => {
    if (directoryQuery.isSuccess) {
      setStep4Selection((prev: any) => {
        return prev != null
          ? prev
          : directoryQuery.data.step_4.map((x: any) => ({
              name: x.name,
              childSelections: x.childSelections.map((y: any) => y.name),
            }));
      });
      setStep4SelectedTags((prev: any) => {
        return prev.length > 0 ? prev : availableTags;
      });
    }
  }, [directoryQuery.isSuccess]);

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.options);
  };
  const onNextClick = async () => {
    router(AppRoutes.installation);
  };

  const onToggle = (checked: boolean, parent: string, child: string) => {
    const parentIndex = step4Selection.findIndex((x: any) => x.name === parent);
    // checked
    if (checked) {
      // check if parent is in current selection, if so add child to it
      if (parentIndex > -1) {
        const newSelection = [...step4Selection];
        newSelection[parentIndex].childSelections.push(child);
        setStep4Selection(newSelection);
      } else {
        // if not, add parent to current selection with child
        const newSelection = [...step4Selection];
        newSelection.push({ name: parent, childSelections: [child] });
        setStep4Selection(newSelection);
      }
    }
    // unchecked
    else {
      // check if parent is in current selection, but now has no children, if so remove it
      if (parentIndex > -1) {
        const newSelection = [...step4Selection];
        newSelection[parentIndex].childSelections = newSelection[
          parentIndex
        ].childSelections.filter((x: any) => x !== child);
        if (newSelection[parentIndex].childSelections.length === 0) {
          newSelection.splice(parentIndex, 1);
        }
        setStep4Selection(newSelection);
      }
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Vanilla Poi Selection</Typography>
            <Typography variant="caption">TODO Description</Typography>
          </Box>
          <Button onClick={() => setStep4Selection([])}>Clear Selection</Button>
        </Box>

        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isError && (
          <Error message={'There was a problem loading the list of mods.'} />
        )}

        {availableFiles && availableTags && (
          <TabSelection
            currentSelection={step4Selection}
            availableFiles={availableFiles}
            onToggle={onToggle}
            availableTags={availableTags}
            selectedTags={step4SelectedTags}
            setSelectedTags={setStep4SelectedTags}
          />
        )}
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button variant="contained" onClick={onNextClick}>
          Download & Install
        </Button>
      </Box>
    </Box>
  );
}
