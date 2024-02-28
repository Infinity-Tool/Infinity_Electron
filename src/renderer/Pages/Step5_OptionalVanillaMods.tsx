import { Box, Button, Typography } from '@mui/material';
import PageContainer from '../Components/PageContainer';
import PageContent from '../Components/PageContent';
import PageFooter from '../Components/PageFooter';
import { AppRoutes } from '../Services/Constants';
import { useNavigate } from 'react-router-dom';
import { headerContainerStyles } from '../Services/CommonStyles';
import ListSelection from '../Components/ListSelection';
import Loading from '../Components/Loading';
import { GetDirectoryFileQuery } from '../Services/http/HttpFunctions';
import { useSelectionContext } from '../Services/SelectionContext';
import Error from '../Components/Error';

export default function Step5_OptionalVanillaMods() {
  const router = useNavigate();
  const { step5Selection, setStep5Selection, excludeTraders, moddedInstall } =
    useSelectionContext();
  const directoryQuery = GetDirectoryFileQuery();
  const availableFiles = directoryQuery.data?.step_5?.sort((a: any, b: any) =>
    a.name.localeCompare(b.name),
  );

  //Functions
  const onParentCheckToggle = (checked: boolean, fileName: string) => {
    if (checked) {
      const newSelection = [...step5Selection];
      newSelection.push({ name: fileName, childSelections: [] });
      setStep5Selection(newSelection);
    } else {
      setStep5Selection((prev: any) => {
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
      const newSelection = [...step5Selection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections.push(childFileName);
      }
      setStep5Selection(newSelection);
    } else {
      const newSelection = [...step5Selection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName,
      );
      if (index > -1) {
        newSelection[index].childSelections = newSelection[
          index
        ].childSelections.filter((x: any) => x !== childFileName);
      }
      setStep5Selection(newSelection);
    }
  };

  //Functions
  const onBackClick = () => {
    router(AppRoutes.vanillaPois);
  };
  const onNextClick = () => {
    router(AppRoutes.preInstallation);
  };

  return (
    <PageContainer>
      <PageContent>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Optional Mods</Typography>
            {/* <Typography variant="caption">
              Add more menu options, new POIs with custom blocks, quest-related
              mods, and more.
            </Typography> */}
          </Box>
          <Button onClick={() => setStep5Selection([])}>Clear Selection</Button>
        </Box>

        {directoryQuery.isLoading && <Loading />}
        {directoryQuery.isError && (
          <Error message={'There was a problem loading the list of mods.'} />
        )}

        <ListSelection
          currentSelection={step5Selection}
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
        <Button onClick={onNextClick} variant="contained">
          Next
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
