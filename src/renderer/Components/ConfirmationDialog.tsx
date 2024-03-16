import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function ConfirmationDialog(props: any) {
  const { open, onCancel, onConfirm, promptTitle, promptDescription } = props;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{promptTitle}</DialogTitle>

      {promptDescription && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {promptDescription}
          </DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        <Button
          onClick={() => {
            onCancel();
          }}
        >
          No
        </Button>
        <Button onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
