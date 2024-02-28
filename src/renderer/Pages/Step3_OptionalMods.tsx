import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListSelection from '../Components/ListSelection';
import { headerContainerStyles } from '../Services/CommonStyles';
import { AppRoutes } from '../Services/Constants';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import Loading from '../Components/Loading';
import Error from '../Components/Error';
import { useSelectionContext } from '../Services/SelectionContext';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';

export default function Step3_OptionalMods(props: any) {
  const router = useNavigate();
  const { step3Selection, setStep3Selection, excludeTraders, moddedInstall } =
    useSelectionContext();
  const directoryQuery = GetDirectoryFileQuery();
  const availableFiles = directoryQuery.data?.step_3?.sort((a: any, b: any) =>
    a.name.localeCompare(b.name),
  );

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.singlePoiSelection);
  };
  const onNextClick = async () => {
    router(AppRoutes.preInstallation);
  };

  const onParentCheckToggle = (checked: boolean, fileName: string) => {
    if (checked) {
      const newSelection = [...step3Selection];
      newSelection.push({ name: fileName, childSelections: [] });
      setStep3Selection(newSelection);
    } else {
      setStep3Selection((prev: any) => {
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
      const newSelection = [...step3Selection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections.push(childFileName);
      }
      setStep3Selection(newSelection);
    } else {
      const newSelection = [...step3Selection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections = newSelection[
          index
        ].childSelections.filter((x: any) => x !== childFileName);
      }
      setStep3Selection(newSelection);
    }
  };

  return (
    <PageContainer>
      <PageContent>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Optional Mods</Typography>
            <Typography variant="caption">
              Add more menu options, new POIs with custom blocks, quest-related
              mods, and more.
            </Typography>
          </Box>
          <Button onClick={() => setStep3Selection([])}>Clear Selection</Button>
        </Box>

        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isError && (
          <Error message={'There was a problem loading the list of mods.'} />
        )}

        <ListSelection
          currentSelection={step3Selection}
          availableFiles={availableFiles}
          onParentCheckToggle={onParentCheckToggle}
          onChildCheckToggle={onChildCheckToggle}
          showDetails={false}
          excludeTraders={excludeTraders}
          moddedInstall={moddedInstall}
        />
      </PageContent>
      <PageFooter>
        <Button onClick={onBackClick}>Back</Button>
        <Button variant="contained" onClick={onNextClick}>
          Next
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
