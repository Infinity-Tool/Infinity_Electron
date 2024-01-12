import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListSelection from '../Components/ListSelection';
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

export default function Step3_OptionalMods(props: any) {
  const router = useNavigate();
  const [currentSelection, setCurrentSelection] = useLocalStorage(
    StorageKeys.step3Selection,
    [],
  );
  const directoryQuery = GetDirectoryFileQuery();
  const availableFiles = directoryQuery.data?.step_3;

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.singlePoiSelection);
  };
  const onNextClick = async () => {
    router(AppRoutes.installation);
  };

  const onParentCheckToggle = (checked: boolean, fileName: string) => {
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
    childFileName: string,
  ) => {
    if (checked) {
      const newSelection = [...currentSelection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections.push(childFileName);
      }
      setCurrentSelection(newSelection);
    } else {
      const newSelection = [...currentSelection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections = newSelection[
          index
        ].childSelections.filter((x: any) => x !== childFileName);
      }
      setCurrentSelection(newSelection);
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Optional Mods</Typography>
            <Typography variant="caption">
              Menu options, custom POIs with blocks, quest-related mods, etc.
            </Typography>
          </Box>
          <Button onClick={() => setCurrentSelection([])}>
            Clear Selection
          </Button>
        </Box>

        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isError && (
          <Error message={'There was a problem loading the list of mods.'} />
        )}

        <ListSelection
          currentSelection={currentSelection}
          availableFiles={availableFiles}
          onParentCheckToggle={onParentCheckToggle}
          onChildCheckToggle={onChildCheckToggle}
          showDetails={false}
        />
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
