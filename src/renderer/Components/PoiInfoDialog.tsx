import {
  Dialog,
  TextField,
  DialogContent,
  Typography,
  useTheme,
} from '@mui/material';
import { dialogStyles } from '../Services/CommonStyles';
import { RemoveZ } from '../Services/utils/NameFormatterUtils';

export default function PoiInfoDialog(props: any) {
  const { dialogState, setDialogState } = props;
  const poi = dialogState.poi;
  const theme = useTheme();

  const dialogContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  };

  return (
    <Dialog
      sx={dialogStyles}
      fullWidth={true}
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
          {poi?.sleeperMin && poi?.sleeperMax && (
            <TextField
              label="Sleeper Counts"
              value={`Min:${poi?.sleeperMin} Max:${poi?.sleeperMax}`}
              disabled={true}
              fullWidth
            />
          )}
          {poi?.prefabSize && (
            <TextField
              label="Prefab Size"
              value={poi?.prefabSize}
              disabled={true}
              fullWidth
            />
          )}
          {poi?.repeatDistance && (
            <TextField
              label="Repeat Distance"
              value={poi?.repeatDistance}
              disabled={true}
              fullWidth
            />
          )}
          {poi?.duplicateRepeatDistance && (
            <TextField
              label="Duplicate Repeat Distance"
              value={poi?.duplicateRepeatDistance}
              disabled={true}
              fullWidth
            />
          )}
          {poi?.tags?.length && (
            <TextField
              label="Tags"
              value={poi?.tags?.join(', ')}
              disabled={true}
              fullWidth
            />
          )}
          {poi?.themeTags?.length && (
            <TextField
              label="Theme Tags"
              value={poi?.themeTags?.join(', ')}
              disabled={true}
              fullWidth
            />
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
