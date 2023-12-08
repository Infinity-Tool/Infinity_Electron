import { Box, Button, Typography } from "@mui/material";
import TabSelection from "Components/TabSelection";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export interface IUserSelection {
  name: string;
  childSelections: string[];
}

export default function StandalonePois() {
  const router = useNavigate();
  const [, setHost] = useLocalStorage(StorageKeys.host, null);
  const [availableFiles, setAvailableFiles]: any = useLocalStorage(
    StorageKeys.availableStep2Files,
    []
  );
  const [currentSelection, setCurrentSelection] = useLocalStorage(
    StorageKeys.step2Selection,
    null
  );
  const [availableTags, setAvailableTags]: any = useState([]);
  const [selectedTags, setSelectedTags]: any = useLocalStorage(
    StorageKeys.selectedTags,
    []
  );

  const { baseUrl } = useHttpContext();

  //Effects
  useEffect(() => {
    GetDirectoryFileHttp(baseUrl).then((res) => {
      setHost(res.host);
      setAvailableFiles(res.step_2);
      setCurrentSelection((prev: any) => {
        return prev != null
          ? prev
          : res.step_2.map((x: any) => ({
              name: x.name,
              childSelections: x.childSelections.map((y: any) => y.name),
            }));
      });
      setAvailableTags(res.editorGroups);
      setSelectedTags((prev: any) => {
        return prev.length > 0 ? prev : res.editorGroups;
      });
    });
  }, []);

  //Functions
  const onBackClick = (event: any) => {
    router(AppRoutes.citiesAndSettlements);
  };
  const onNextClick = async () => {
    router(AppRoutes.optionalMods);
  };

  const onToggle = (checked: boolean, parent: string, child: string) => {
    const parentIndex = currentSelection.findIndex(
      (x: any) => x.name === parent
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
