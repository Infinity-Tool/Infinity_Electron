import { Box, Button, Typography } from "@mui/material";
import ListSelection from "Components/ListSelection";
import {
  headerContainerStyles,
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import StorageKeys from "Services/StorageKeys";
import { useHttpContext } from "Services/http/HttpContext";
import { GetDirectoryFileHttp } from "Services/http/HttpFunctions";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export interface IUserSelection {
  name: string;
  childSelections: string[];
}

export default function CitiesAndSettlements() {
  const router = useNavigate();
  const { baseUrl } = useHttpContext();
  const [, setHost] = useLocalStorage(StorageKeys.host, null);
  const [availableFiles, setAvailableFiles]: any = useLocalStorage(
    StorageKeys.availableStep1Files,
    []
  );
  const [currentSelection, setCurrentSelection] = useLocalStorage(
    StorageKeys.step1Selection,
    []
  );

  //Effects
  useEffect(() => {
    GetDirectoryFileHttp(baseUrl).then((res) => {
      setHost(res.host);
      setAvailableFiles(res.step_1);
    });
  }, []);

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.options);
  };
  const onNextClick = async () => {
    router(AppRoutes.singlePoiSelection);
  };

  const onParentCheckToggle = (checked: boolean, fileName: string) => {
    console.log("checked", checked, "fileName", fileName);
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
    childFileName: string
  ) => {
    if (checked) {
      const newSelection = [...currentSelection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName
      );
      if (index > -1) {
        newSelection[index].childSelections.push(childFileName);
      }
      setCurrentSelection(newSelection);
    } else {
      const newSelection = [...currentSelection];
      const index = newSelection.findIndex(
        (x: any) => x.name === parentFileName
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
      {/* <Button onClick={ConfigureSelectedFiles}>Test (delete me)</Button> */}
      <Box sx={pageContentStyles}>
        <Box sx={headerContainerStyles}>
          <Box>
            <Typography variant="h1">Cities & Settlements</Typography>
            <Typography variant="caption">
              Add entire cities to your world and
            </Typography>
          </Box>
          <Button onClick={() => setCurrentSelection([])}>
            Clear Selection
          </Button>
        </Box>

        <ListSelection
          currentSelection={currentSelection}
          availableFiles={availableFiles}
          onParentCheckToggle={onParentCheckToggle}
          onChildCheckToggle={onChildCheckToggle}
        />
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button
          variant="contained"
          onClick={onNextClick}
          // disabled={currentSelection.length === 0}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
