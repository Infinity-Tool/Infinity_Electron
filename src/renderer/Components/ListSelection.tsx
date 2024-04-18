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
import PoiItem from '../Models/PoiItem';

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

  const activeConflictKeys = useMemo<string[]>(() => {
    if (!currentSelection) return [];

    const selectedConflictKeys: string[] = [];

    currentSelection.forEach((parent: any) => {
      const foundParent = availableFiles?.find(
        (f: any) => f.name === parent.name,
      );

      if (foundParent && foundParent.conflictKey) {
        selectedConflictKeys.push(foundParent.conflictKey);
      }

      parent.childSelections.forEach((child: any) => {
        if (child.conflictKey) {
          selectedConflictKeys.push(child.conflictKey);
        }
      });
    });

    return selectedConflictKeys;
  }, [currentSelection]);

  const filteredSelection = useMemo(() => {
    const filtered = availableFiles?.map((x: any) => {
      x.childSelections = x.childSelections
        .filter(
          (y: any) =>
            !excludeTraders ||
            !y.editorGroups?.includes(TRADER_TAG(moddedInstall)),
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
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
              key={parent.name}
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
                          <Checkbox
                            checked={selected}
                            onClick={toggle}
                            disabled={
                              !selected &&
                              parent.conflictKey &&
                              activeConflictKeys?.includes(parent.conflictKey)
                            }
                          />
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
                    const tabFile = new PoiItem(
                      parent.name,
                      child.name,
                      child.description,
                      child.images,
                      child.editorGroups,
                      child.tags,
                      child.themeTags,
                      child.themeRepeatDistance,
                      child.duplicateRepeatDistance,
                      child.sleeperMin,
                      child.sleeperMax,
                      child.prefabSize,
                      child.conflictKey,
                    );
                    return (
                      <div key={`${parent.name}_${child.name}`}>
                        <Divider variant="middle" />
                        <PoiListItem
                          index={tabFile.name + tabFile.parent}
                          tabFile={tabFile}
                          onToggle={onChildCheckToggle}
                          setInfoDialogState={setInfoDialogState}
                          selectedTags={[]}
                          selection={currentSelection}
                          activeConflictKeys={activeConflictKeys}
                        />
                      </div>
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
