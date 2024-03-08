import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

export default function FolderHelpDialog(props: any) {
  const { helpDialogOpen, setHelpDialogOpen } = props;

  return (
    <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)}>
      <DialogTitle>Help</DialogTitle>
      <DialogContent>
        <Typography>
          <strong>Windows</strong>
        </Typography>
        <Typography>C:\Users\(your user)\AppData\Roaming\7DaysToDie</Typography>
        <Typography variant="caption">
          You can get here by typing <strong>%appdata%</strong> in the address
          bar of your file explorer.
        </Typography>
        <br />
        <Typography variant="caption">
          If these folders do not exist then you may need to create them.
        </Typography>
        <Typography>
          Folders should be named exactly: <div>LocalPrefabs</div>{' '}
          <div>Mods</div>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
