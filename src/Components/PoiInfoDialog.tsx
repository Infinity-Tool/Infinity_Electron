import { Dialog, Box, TextField } from "@mui/material";
import { dialogStyles } from "Services/CommonStyles";

export default function PoiInfoDialog(props: any) {
  const { dialogState, setDialogState } = props;
  return (
    <Dialog
      sx={dialogStyles}
      open={dialogState.open}
      onClose={() => {
        setDialogState({
          open: false,
          poi: null,
        });
      }}
    >
      <Box>
        <TextField
          label="Repeat Distance"
          value={dialogState.poi?.repeatDistance}
          disabled={true}
          variant="standard"
        />
        <TextField
          label="Duplicate Repeat Distance"
          value={dialogState.poi?.duplicateRepeatDistance}
          disabled={true}
          variant="standard"
        />
        <TextField
          label="Tags"
          value={dialogState.poi?.tags?.join(", ")}
          disabled={true}
          variant="standard"
        />
        <TextField
          label="Theme Tags"
          value={dialogState.poi?.themeTags?.join(", ")}
          disabled={true}
          variant="standard"
        />
      </Box>
    </Dialog>
  );
}
