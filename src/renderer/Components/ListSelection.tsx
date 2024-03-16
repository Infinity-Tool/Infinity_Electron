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
  List,
  Typography,
  useTheme,
} from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import '../Assets/css/react-medium-image-zoom-overrides.css';
import { useMemo, useState } from 'react';
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
    gap: theme.spacing(1),
    height: '100%',
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

  const settlementInfoContainerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    width: '100%',
  };

  const justifyApartStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

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
              >
                <Box sx={settlementInfoContainerStyles}>
                  <Box sx={justifyApartStyles}>
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox checked={selected} onClick={toggle} />
                        }
                        label={RemoveZ(parent.name)}
                        slotProps={{ typography: { sx: parentTitleStyles } }}
                      />
                      <Typography variant="caption">
                        {parent.description}
                      </Typography>
                    </FormControl>

                    <Typography variant="caption" color="text.secondary">
                      {parent.childSelections?.length > 0 &&
                        `${parent.childSelections.length} sub-selection(s) available`}
                    </Typography>
                  </Box>
                  {parent.image && (
                    <Zoom>
                      <img
                        src={`${baseUrl}/${parent.image}`}
                        alt=""
                        loading="lazy"
                        style={{ maxHeight: '120px' }}
                        decoding="async"
                        crossOrigin="anonymous"
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
                <List>
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
                        <Divider variant="middle" />
                        <PoiListItem
                          index={tabFile.name + tabFile.parent}
                          tabFile={tabFile}
                          onToggle={onChildCheckToggle}
                          setInfoDialogState={setInfoDialogState}
                          selectedTags={[]}
                          selection={currentSelection}
                        />
                      </>
                    );
                  })}
                </List>
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
