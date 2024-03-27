import {
  Dialog,
  TextField,
  DialogContent,
  Typography,
  useTheme,
  ImageList,
  ImageListItem,
  Box,
} from '@mui/material';
import { dialogStyles } from '../Services/CommonStyles';
import { RemoveZ } from '../Services/utils/NameFormatterUtils';
import { useHttpContext } from '../Services/http/HttpContext';
import Zoom from 'react-medium-image-zoom';

export default function PoiInfoDialog(props: any) {
  const { dialogState, setDialogState } = props;
  const { baseUrl } = useHttpContext();
  const poi = dialogState.poi;
  const theme = useTheme();

  const dialogContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  };

  const imgStyles = {
    height: '100px',
  };

  const bodyContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
  };
  const imageContainerStyles = {
    flex: '1 0 auto',
  };

  const infoContainerStyles = {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    mt: theme.spacing(2),
  };

  return (
    <Dialog
      sx={dialogStyles}
      maxWidth="md"
      fullWidth
      open={dialogState.open}
      onClose={() => {
        setDialogState({
          open: false,
          poi: null,
        });
      }}
    >
      {poi && (
        <DialogContent sx={dialogContentStyles}>
          <Typography variant="h4">{RemoveZ(poi?.name)}</Typography>
          <Typography>{poi.description}</Typography>

          <Box sx={bodyContainerStyles}>
            {/* <Box sx={imageContainerStyles}>
              <ImageList cols={poi.images?.length} sx={imageContainerStyles}>
                {poi.images?.map((img: string) => (
                  <ImageListItem>
                    <Zoom ={()=>{}}>
                      <img
                        src={`${baseUrl}/${img}`}
                        alt={poi.name}
                        style={imgStyles}
                        loading="lazy"
                        decoding="async"
                        crossOrigin="anonymous"
                      />
                    </Zoom>
                  </ImageListItem>
                ))}
              </ImageList>
            </Box> */}

            <Box sx={infoContainerStyles}>
              {poi?.sleeperMin && poi?.sleeperMax && (
                <TextField
                  label="Sleeper Counts"
                  value={`Min:${poi?.sleeperMin}  Max:${poi?.sleeperMax}`}
                  fullWidth
                />
              )}
              {poi?.prefabSize && (
                <TextField
                  label="Prefab Size"
                  value={poi?.prefabSize}
                  fullWidth
                />
              )}
              {poi?.themeRepeatDistance && (
                <TextField
                  label="Theme Repeat Distance"
                  value={poi?.themeRepeatDistance}
                  fullWidth
                />
              )}
              {poi?.duplicateRepeatDistance && (
                <TextField
                  label="Duplicate Repeat Distance"
                  value={poi?.duplicateRepeatDistance}
                  fullWidth
                />
              )}
              {poi?.tags?.length && (
                <TextField
                  label="Tags"
                  value={poi?.tags?.join(', ')}
                  fullWidth
                />
              )}
              {poi?.themeTags?.length && (
                <TextField
                  label="Theme Tags"
                  value={poi?.themeTags?.join(', ')}
                  fullWidth
                />
              )}
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}
