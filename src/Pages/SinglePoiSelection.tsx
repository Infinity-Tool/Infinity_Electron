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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export interface IUserSelection {
  name: string;
  childSelections: string[];
}

export default function StandalonePois() {
  const router = useNavigate();
  const [, setHost] = useLocalStorage(LocalStorageKeys.host, null);
  const [availableFiles, setAvailableFiles]: any = useLocalStorage(
    LocalStorageKeys.availableStep2Files,
    []
  );
  const [currentSelection, setCurrentSelection] = useLocalStorage(
    LocalStorageKeys.step2Selection,
    []
  );
  const [availableTags, setAvailableTags]: any = useState([]);
  const [selectedTags, setSelectedTags]: any = useLocalStorage(
    LocalStorageKeys.selectedTags,
    []
  );

  //Effects
  useEffect(() => {
    GetDirectoryFileHttp().then((res) => {
      setHost(res.host);
      setAvailableFiles(res.step_2);
      setCurrentSelection((prev: any) => {
        return prev.length > 0
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
    router(AppRoutes.installation);
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

  // const onParentCheckToggle = (checked: boolean, fileName: string) => {
  //   const alreadyAdded = currentSelection.some((x: any) => x.name === fileName);

  //   if (checked && !alreadyAdded) {
  //     const newSelection = [...currentSelection];
  //     newSelection.push({ name: fileName, childSelections: [] });
  //     setCurrentSelection(newSelection);
  //   } else {
  //     setCurrentSelection((prev: any) => {
  //       return prev.filter((x: any) => x.name !== fileName);
  //     });
  //   }
  // };

  // const onChildCheckToggle = (
  //   checked: boolean,
  //   parentFileName: string,
  //   childFileName: string
  // ) => {
  //   if (checked) {
  //     const newSelection = [...currentSelection];
  //     const index = newSelection.findIndex(
  //       (x: any) => x.name === parentFileName
  //     );
  //     if (index > -1) {
  //       newSelection[index].childSelections.push(childFileName);
  //     }
  //     setCurrentSelection(newSelection);
  //   } else {
  //     const newSelection = [...currentSelection];
  //     const index = newSelection.findIndex(
  //       (x: any) => x.name === parentFileName
  //     );
  //     if (index > -1) {
  //       newSelection[index].childSelections = newSelection[
  //         index
  //       ].childSelections.filter((x: any) => x !== childFileName);
  //     }
  //     setCurrentSelection(newSelection);
  //   }
  // };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageContentStyles}>
        <Typography variant="h1">Single POI Selection</Typography>
        <Button onClick={() => setCurrentSelection([])}>Clear Selection</Button>
        {availableFiles && availableTags && (
          <TabSelection
            currentSelection={currentSelection}
            availableFiles={availableFiles}
            onToggle={onToggle}
            // onParentCheckToggle={onParentCheckToggle}
            // onChildCheckToggle={onChildCheckToggle}
            availableTags={availableTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        )}
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
