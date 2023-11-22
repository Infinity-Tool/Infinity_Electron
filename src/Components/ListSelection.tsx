import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import Loading from "./Loading";
import { useHttpContext } from "Services/http/HttpContext";
import Zoom from "react-medium-image-zoom";
import "Assets/css/react-medium-image-zoom-overrides.css";

export default function ListSelection(props: any) {
  const theme = useTheme();
  const { baseUrl } = useHttpContext();

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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start",
    };
  };
  const childContainerStyles = {
    paddingLeft: "2rem",
  };
  const imageContainerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& img": {
      maxHeight: "200px",
      maxWidth: "200px",
    },
  };

  return (
    <Box sx={modListContainer}>
      {availableFiles == null && <Loading />}
      {availableFiles?.map((tas: any, index: number) => (
        <Paper sx={getModListItemStyles(tas.name)} key={index}>
          <Box>
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
              <Typography variant="caption">{tas.description}</Typography>
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
          </Box>
          <Box sx={imageContainerStyles}>
            <Zoom>
              <img src={`${baseUrl}/${tas.image}`} />
            </Zoom>
          </Box>
        </Paper>
      ))}
      {availableFiles == null && <div>loading...</div>}
    </Box>
  );
}
