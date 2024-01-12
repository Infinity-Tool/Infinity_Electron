import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  ImageList,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import '../Assets/css/react-medium-image-zoom-overrides.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading';
import PoiInfoDialog from './PoiInfoDialog';
import {
  imageContainerStyles,
  poiStyles,
  imageListStyles,
} from '../Services/CommonStyles';
import { RemoveZ } from '../Services/Utils/NameFormatterUtils';
import { useHttpContext } from '../Services/http/HttpContext';
import { Virtuoso } from 'react-virtuoso';

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
    childFileName: string,
  ): boolean => {
    const parentIndex = currentSelection.findIndex(
      (x: any) => x.name === parentFileName,
    );
    if (parentIndex === -1) return false;
    const childIndex = currentSelection[parentIndex]?.childSelections.findIndex(
      (x: any) => x === childFileName,
    );
    return childIndex > -1;
  };

  //Styles
  const modListContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%',
  };
  const getModListItemStyles = (file: string) => {
    const isSelected = getIsSelected(file);
    return {
      padding: '1rem',
      border: isSelected
        ? `1px solid ${theme.palette.primary.dark}`
        : '1px solid transparent',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
    };
  };
  const childContainerStyles = {
    paddingLeft: '2rem',
  };

  return (
    <>
      <Box sx={modListContainer}>
        <Virtuoso
          style={{ height: '100%' }}
          totalCount={availableFiles?.length}
          // eslint-disable-next-line react/no-unstable-nested-components
          itemContent={(index) => {
            const parent = availableFiles[index];
            const selected = getIsSelected(parent.name);

            return (
              <Paper sx={getModListItemStyles(parent.name)} key={index}>
                <Box>
                  <Box>
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selected}
                            onClick={(e: any) =>
                              onParentCheckToggle(e.target.checked, parent.name)
                            }
                          />
                        }
                        label={RemoveZ(parent.name)}
                      />
                      <Typography variant="caption">
                        {parent.description}
                      </Typography>
                    </FormControl>
                    {parent.image && (
                      <Box sx={imageContainerStyles}>
                        <Zoom>
                          <img src={`${baseUrl}/${parent.image}`} alt="" />
                        </Zoom>
                      </Box>
                    )}
                  </Box>
                  <Box sx={childContainerStyles}>
                    {parent.childSelections?.length > 0 &&
                      parent.childSelections.map((child: any) => {
                        const selected = getIsChildSelected(
                          parent.name,
                          child.name,
                        );
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
                                    disabled={!getIsSelected(parent.name)}
                                    checked={selected}
                                    onClick={(e: any) =>
                                      onChildCheckToggle(
                                        e.target.checked,
                                        parent.name,
                                        child.name,
                                      )
                                    }
                                  />
                                }
                                label={RemoveZ(child.name)}
                              />
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
                                <ImageList sx={imageContainerStyles}>
                                  <Zoom>
                                    <img
                                      src={baseUrl + '/' + img}
                                      alt={child.name}
                                      style={{ width: '100%' }}
                                    />
                                  </Zoom>
                                </ImageList>
                              ))}
                            </Box>
                          </Paper>
                        );
                      })}
                  </Box>
                </Box>
              </Paper>
            );
          }}
        />
      </Box>
      {/* Info Popover */}
      <PoiInfoDialog
        dialogState={infoDialogState}
        setDialogState={setInfoDialogState}
      />
    </>
  );
}
