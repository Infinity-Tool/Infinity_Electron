import { Box, Button, Typography } from "@mui/material";
import TabSelection from "Components/TabSelection";
import {
  pageContainerStyles,
  pageContentStyles,
  pageFooterStyles,
} from "Services/CommonStyles";
import { AppRoutes } from "Services/Constants";
import LocalStorageKeys from "Services/LocalStorageKeys";
import { GetDirectoryFileHttp } from "Services/http/Directory";
import useLocalStorage from "Services/useLocalStorage";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export interface IUserSelection {
  name: string;
  childSelections: string[];
}

export default function StandalonePois() {
  const router = useNavigate();
  const [, setHost] = useLocalStorage(LocalStorageKeys.host, null);
  const [availableFiles, setAvailableFiles]: any = useLocalStorage(
    LocalStorageKeys.availableFiles,
    []
  );
  const [currentSelection, setCurrentSelection] = useLocalStorage(
    LocalStorageKeys.step2Selection,
    []
  );
  const [availableTags, setAvailableTags]: any = useState([]);

  //Effects
  useEffect(() => {
    GetDirectoryFileHttp().then((res) => {
      setHost(res.host);
      setAvailableFiles(res.step_2);
      setAvailableTags(res.editorGroups);
    });
  }, []);

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.citiesAndSettlements);
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
      <Box sx={pageContentStyles}>
        <Typography variant="h1">Single POI Selection</Typography>
        <Button onClick={() => setCurrentSelection([])}>Clear Selection</Button>
        <TabSelection
          currentSelection={currentSelection}
          availableFiles={availableFiles}
          onParentCheckToggle={onParentCheckToggle}
          onChildCheckToggle={onChildCheckToggle}
          availableTags={availableTags}
        />
      </Box>
      <Box sx={pageFooterStyles}>
        <Button onClick={onBackClick}>Back</Button>
        <Button
          variant="contained"
          onClick={onNextClick}
          disabled={currentSelection.length === 0}
        >
          Download & Install
        </Button>
      </Box>
    </Box>
  );
}
