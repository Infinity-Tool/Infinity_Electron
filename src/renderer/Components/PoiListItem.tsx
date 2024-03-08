/* eslint-disable prettier/prettier */
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ListItem,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  Chip,
  ImageList,
  ImageListItem,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';
import { RemoveZ, ProperCase } from '../Services/utils/NameFormatterUtils';
import { useHttpContext } from '../Services/http/HttpContext';
import { poiStyles } from '../Services/CommonStyles';
import Zoom from 'react-medium-image-zoom';

export default function PoiListItem(props: any) {
  const {
    index,
    poiInfoStyles,
    tabFile,
    onToggle,
    setInfoDialogState,
    selectedTags,
    selection,
  } = props;

  const theme = useTheme();
  const { baseUrl } = useHttpContext();

  const selected = useMemo(() => {
    const parentIndex = selection.findIndex(
      (x: any) => x.name === tabFile.parent,
    );
    if (parentIndex === -1) return false;
    return selection[parentIndex]?.childSelections.includes(tabFile.name);
  }, [selection, tabFile]);

  const chipVariant = (tag: string) =>
    selectedTags.includes(tag) ? 'filled' : 'outlined';

  const poiStylesMemo = useMemo(() => {
    return poiStyles(theme, selected);
  }, [selected, theme]);

  // Styles
  const tagChipContainerStyles = {
    display: 'flex',
    gap: theme.spacing(0.5),
  };
  const imageContainerStyles = {
    maxWidth: '50%',
  };

  return (
    <ListItem key={index} sx={poiStylesMemo}>
      <Box sx={poiInfoStyles}>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={selected}
                onClick={(e: any) => {
                  onToggle(e.target.checked, tabFile.parent, tabFile.name);
                }}
              />
            }
            label={RemoveZ(tabFile.name)}
          />
        </FormControl>
        <IconButton
          onClick={(e) => {
            setInfoDialogState({
              open: true,
              poi: tabFile,
            });
          }}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            color={theme.palette.text.secondary}
          />
        </IconButton>
        <Typography>{tabFile.description}</Typography>
        <Box sx={tagChipContainerStyles}>
          {tabFile.editorGroups?.map((eg: string) => (
            <Chip
              label={ProperCase(eg)}
              size="small"
              color="default"
              variant={chipVariant(eg)}
            />
          ))}
        </Box>
      </Box>
      <ImageList
        rowHeight={100}
        cols={tabFile.images?.length}
        sx={imageContainerStyles}
      >
        {tabFile.images?.map((img: string) => (
          <ImageListItem>
            <Zoom>
              <img
                src={`${baseUrl}/${img}`}
                alt={tabFile.name}
                style={{ maxHeight: '90px' }}
                loading="lazy"
              />
            </Zoom>
          </ImageListItem>
        ))}
      </ImageList>
    </ListItem>
  );
}
