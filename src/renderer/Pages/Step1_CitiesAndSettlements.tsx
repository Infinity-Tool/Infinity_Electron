import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListSelection from '../Components/ListSelection';
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

export default function CitiesAndSettlements() {
  const router = useNavigate();
  const { step1Selection, setStep1Selection }: any = useSelectionContext();
  const directoryQuery = GetDirectoryFileQuery();
  const availableFiles = directoryQuery.data?.step_1;

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.options);
  };
  const onNextClick = async () => {
    router(AppRoutes.singlePoiSelection);
  };

  const onParentCheckToggle = (checked: boolean, fileName: string) => {
    // console.log('checked', checked, 'fileName', fileName);
    if (checked) {
      const newSelection = [...step1Selection];
      newSelection.push({ name: fileName, childSelections: [] });
      setStep1Selection(newSelection);
    } else {
      setStep1Selection((prev: any) => {
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
      const newSelection = [...step1Selection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections.push(childFileName);
      }
      setStep1Selection(newSelection);
    } else {
      const newSelection = [...step1Selection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections = newSelection[
          index
        ].childSelections.filter((x: any) => x !== childFileName);
      }
      setStep1Selection(newSelection);
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      {/* <Button onClick={ConfigureSelectedFiles}>Test (delete me)</Button> */}
      <Box sx={pageContentStyles}>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Cities & Settlements</Typography>
            <Typography variant="caption">
              Add entire cities to your world and
            </Typography>
          </Box>
          <Button onClick={() => setStep1Selection([])}>Clear Selection</Button>
        </Box>

        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isError && (
          <Error message={'There was a problem loading the list of mods.'} />
        )}

        <ListSelection
          currentSelection={step1Selection}
          availableFiles={availableFiles}
          onParentCheckToggle={onParentCheckToggle}
          onChildCheckToggle={onChildCheckToggle}
          showDetails={true}
        />
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
