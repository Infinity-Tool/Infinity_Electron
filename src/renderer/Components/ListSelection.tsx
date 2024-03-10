/* eslint-disable prettier/prettier */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import '../Assets/css/react-medium-image-zoom-overrides.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import PoiInfoDialog from './PoiInfoDialog';
import { RemoveZ } from '../Services/utils/NameFormatterUtils';
import { useHttpContext } from '../Services/http/HttpContext';
import { TRADER_TAG } from '../Services/Constants';
import PoiListItem from './PoiListItem';

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
    selectAll,
    excludeTraders,
    moddedInstall,
  } = props;

  const getIsSelected = (fileName: string): boolean => {
    return currentSelection.some((x: any) => x.name === fileName);
  };

  const filteredSelection = useMemo(() => {
    const filtered = availableFiles?.map((x: any) => {
      if (excludeTraders) {
        x.childSelections = x.childSelections.filter(
          (y: any) => !y.editorGroups?.includes(TRADER_TAG(moddedInstall)),
        );
      }
      return x;
    });

    return filtered;
  }, [availableFiles]);

  //Styles
  const modListContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    height: '100%',
  };

  const poiInfoStyles = {
    maxWidth: '66%',
  };
  const parentTitleStyles = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };
  const accordionSummaryStyles = (opened: boolean): any => ({
    position: 'sticky',
    top: -1,
    background: theme.palette.background.paper,
    zIndex: 1,
    boxShadow: opened && '0px 2px 4px rgba(0, 0, 0, 0.2)',
  });

  return (
    <>
      <Box sx={modListContainer}>
        {filteredSelection?.map((parent: any) => {
          const selected = getIsSelected(parent.name);
          const toggle = (e: any) => {
            onParentCheckToggle(!selected, parent.name);
          };
          const hasChildren = parent.childSelections?.length > 0;

          return (
            <Accordion
              expanded={selected && hasChildren}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                sx={accordionSummaryStyles(selected)}
                key={`${parent.name}_index`}
                expandIcon={
                  hasChildren && (
                    <IconButton onClick={toggle}>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </IconButton>
                  )
                }
              >
                <Box sx={poiInfoStyles}>
                  <FormControl>
                    <FormControlLabel
                      control={<Checkbox checked={selected} onClick={toggle} />}
                      label={RemoveZ(parent.name)}
                      slotProps={{ typography: { sx: parentTitleStyles } }}
                    />
                    <Typography variant="caption">
                      {parent.description}
                    </Typography>
                  </FormControl>

                  {parent.image && (
                    <Zoom>
                      <img
                        src={`${baseUrl}/${parent.image}`}
                        alt=""
                        loading="lazy"
                        style={{ maxHeight: '90px' }}
                      />
                    </Zoom>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {selectAll && (
                  <Button onClick={() => selectAll(parent.name)}>
                    Select All
                  </Button>
                )}
                {parent.childSelections?.map((child: any) => {
                  const tabFile = {
                    parent: parent.name,
                    name: child.name,
                    description: child.description,
                    images: child.images,
                    editorGroups: child.editorGroups,
                  };
                  return (
                    <>
                      <PoiListItem
                        index={tabFile.name + tabFile.parent}
                        poiInfoStyles={poiInfoStyles}
                        tabFile={tabFile}
                        onToggle={onChildCheckToggle}
                        setInfoDialogState={setInfoDialogState}
                        selectedTags={[]}
                        selection={currentSelection}
                      />
                      <Divider variant="middle" />
                    </>
                  );
                })}

                {/* <Box sx={childContainerStyles}>
                    {parent.childSelections?.length > 0 &&
                      parent.childSelections
                        .sort((a: any, b: any) => a.name.localeCompare(b.name))
                        .map((child: any) => {
                          const tabFile = {
                            parent: parent.name,
                            name: child.name,
                            description: child.description,
                            images: child.images,
                            editorGroups: child.editorGroups,
                          };

                          return (
                            <PoiListItem
                              index={index}
                              poiInfoStyles={poiInfoStyles}
                              tabFile={tabFile}
                              onToggle={onChildCheckToggle}
                              setInfoDialogState={setInfoDialogState}
                              selectedTags={[]}
                              selection={currentSelection}
                            />
                          );
                        })}
                  </Box> */}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
      {/* Info Popover */}
      <PoiInfoDialog
        dialogState={infoDialogState}
        setDialogState={setInfoDialogState}
      />
    </>
  );
}
