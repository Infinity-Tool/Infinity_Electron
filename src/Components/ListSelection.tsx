import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import Loading from "./Loading";
import { useHttpContext } from "Services/http/HttpContext";
import Zoom from "react-medium-image-zoom";
import "Assets/css/react-medium-image-zoom-overrides.css";
import { RemoveZ } from "Services/Utils/NameFormatterUtils";
import {
  imageContainerStyles,
  imageListStyles,
  poiStyles,
} from "Services/CommonStyles";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import PoiInfoDialog from "./PoiInfoDialog";

export default function ListSelection(props: any) {
  const theme = useTheme();
  const { baseUrl } = useHttpContext();
  const [infoDialogState, setInfoDialogState]: any = useState({
    open: false,
    poi: null,
  });

  const {
    currentSelection,
    availableFiles,
    onParentCheckToggle,
    onChildCheckToggle,
    showDetails,
  } = props;

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

  return (
    <>
      <Box sx={modListContainer}>
        {availableFiles == null && <Loading />}
        {availableFiles?.map((tas: any, index: number) => {
          return (
            <Paper sx={getModListItemStyles(tas.name)} key={index}>
              <Box>
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
                      label={RemoveZ(tas.name)}
                    ></FormControlLabel>
                    <Typography variant="caption">{tas.description}</Typography>
                  </FormControl>
                  {tas.image && (
                    <Box sx={imageContainerStyles}>
                      <Zoom>
                        <img src={`${baseUrl}/${tas.image}`} alt="" />
                      </Zoom>
                    </Box>
                  )}
                </Box>
                <Box sx={childContainerStyles}>
                  {tas.childSelections?.length > 0 &&
                    tas.childSelections.map((child: any) => {
                      const selected = getIsChildSelected(tas.name, child.name);
                      return (
                        <Paper
                          elevation={3}
                          sx={poiStyles(theme, selected)}
                          key={index}
                        >
                          <FormControl>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={!getIsSelected(tas.name)}
                                  checked={selected}
                                  onClick={(e: any) =>
                                    onChildCheckToggle(
                                      e.target.checked,
                                      tas.name,
                                      child.name
                                    )
                                  }
                                />
                              }
                              label={RemoveZ(child.name)}
                            ></FormControlLabel>
                          </FormControl>
                          {showDetails && (
                            <IconButton
                              onClick={(e) => {
                                setInfoDialogState({
                                  open: true,
                                  poi: child,
                                });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faInfoCircle}
                                color={theme.palette.text.secondary}
                              />
                            </IconButton>
                          )}
                          <Typography>{child.description}</Typography>
                          <Box sx={imageListStyles}>
                            {child.images?.map((img: string) => (
                              <Box sx={imageContainerStyles}>
                                <Zoom>
                                  <img
                                    src={baseUrl + "/" + img}
                                    alt={child.name}
                                    style={{ width: "100%" }}
                                  ></img>
                                </Zoom>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      );
                    })}
                </Box>
              </Box>
            </Paper>
          );
        })}
        {availableFiles == null && <div>loading...</div>}
      </Box>
      {/* Info Popover */}
      {
        <PoiInfoDialog
          dialogState={infoDialogState}
          setDialogState={setInfoDialogState}
        />
      }
    </>
  );
}
