import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  useTheme,
} from "@mui/material";
import Loading from "./Loading";

export default function ListSelection(props: any) {
  const theme = useTheme();

  const currentSelection = props.currentSelection;
  const availableFiles = props.availableFiles;
  const onParentCheckToggle = props.onParentCheckToggle;
  const onChildCheckToggle = props.onChildCheckToggle;

  const getIsSelected = (fileName: string): boolean => {
    return currentSelection.some((x: any) => x.name === fileName);
  };

  const getIsChildSelected = (
    parentFileName: string,
    childFileName: string
  ): boolean => {
    const parentIndex = currentSelection.findIndex(
      (x: any) => x.name === parentFileName
    );
    if (parentIndex === -1) return false;
    const childIndex = currentSelection[parentIndex]?.childSelections.findIndex(
      (x: any) => x === childFileName
    );
    return childIndex > -1;
  };

  //Styles
  const modListContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };
  const getModListItemStyles = (file: string) => {
    const isSelected = getIsSelected(file);
    return {
      padding: "1rem",
      border: isSelected
        ? `1px solid ${theme.palette.primary.dark}`
        : "1px solid transparent",
      // transform: isSelected ? "" : "scale(.96)",
      // transition: "all .3s ease-in-out",
    };
  };
  const childContainerStyles = {
    paddingLeft: "2rem",
  };

  return (
    <Box sx={modListContainer}>
      {availableFiles == null && <Loading />}
      {availableFiles?.map((tas: any, index: number) => (
        <Paper sx={getModListItemStyles(tas.name)} key={index}>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={getIsSelected(tas.name)}
                  onClick={(e: any) =>
                    onParentCheckToggle(e.target.checked, tas.name)
                  }
                />
              }
              label={tas.name}
            ></FormControlLabel>
          </FormControl>

          <Box sx={childContainerStyles}>
            {tas.childSelections?.length > 0 &&
              tas.childSelections.map((child: any) => (
                <Box>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={!getIsSelected(tas.name)}
                          checked={getIsChildSelected(tas.name, child.name)}
                          onClick={(e: any) =>
                            onChildCheckToggle(
                              e.target.checked,
                              tas.name,
                              child.name
                            )
                          }
                        />
                      }
                      label={child.name}
                    ></FormControlLabel>
                  </FormControl>
                </Box>
              ))}
          </Box>
        </Paper>
      ))}
      {availableFiles == null && <div>loading...</div>}
    </Box>
  );
}
