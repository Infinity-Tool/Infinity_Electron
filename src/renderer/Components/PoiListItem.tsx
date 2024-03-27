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
import Zoom from 'react-medium-image-zoom';

export default function PoiListItem(props: any) {
  const {
    index,
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

  const poiStyles = {
    paddingY: theme.spacing(1),
    paddingX: theme.spacing(2),
    marginY: theme.spacing(1),
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  };

  // Styles
  const tagChipContainerStyles = {
    display: 'flex',
    gap: theme.spacing(0.5),
    mt: theme.spacing(1),
  };
  const imageContainerStyles = {
    maxWidth: '50%',
  };
  const infoContainerStyles = {
    maxWidth: '66%',
    overflowWrap: 'break-word',
  };
  const imgStyles = {
    height: '90px',
  };

  return (
    <ListItem key={index} sx={poiStyles} dense>
      <Box sx={infoContainerStyles}>
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
              key={`${tabFile.name}_${eg}`}
              label={ProperCase(eg)}
              size="small"
              color="default"
              variant={chipVariant(eg)}
            />
          ))}
        </Box>
      </Box>
      <ImageList cols={tabFile.images?.length} sx={imageContainerStyles}>
        {tabFile.images?.map((img: string) => (
          <ImageListItem>
            <Zoom>
              <img
                src={`${baseUrl}/${img}`}
                alt={tabFile.name}
                style={imgStyles}
                loading="lazy"
                decoding="async"
                crossOrigin="anonymous"
              />
            </Zoom>
          </ImageListItem>
        ))}
      </ImageList>
    </ListItem>
  );
}
