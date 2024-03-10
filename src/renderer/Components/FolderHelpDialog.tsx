import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';

export default function FolderHelpDialog(props: any) {
  const { helpDialogOpen, setHelpDialogOpen } = props;
  const theme = useTheme();

  const pathStyles = {
    p: theme.spacing(1),
    my: theme.spacing(0.5),
  };
  const dividerStyles = {
    my: theme.spacing(2),
  };

  return (
    <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)}>
      <DialogTitle color="text.secondary">Help</DialogTitle>
      <DialogContent>
        <Typography variant="h5">Windows</Typography>
        <Paper sx={pathStyles} elevation={5}>
          C:\Users\(your user)\AppData\Roaming\7DaysToDie
        </Paper>
        <Typography variant="caption">
          You can get here by typing <strong>%appdata%</strong> in the address
          bar of your file explorer.
        </Typography>
        <br />
        <br />
        <Typography variant="h5">Linux</Typography>
        <Paper sx={pathStyles} elevation={5}>
          \home\username\.local\share\7DaysToDie
        </Paper>
        <Typography variant="caption">
          In your file explorer, you may need to enable hidden files to see the
          .local folder.
        </Typography>
        <br />
        <Divider sx={dividerStyles} />
        <Typography variant="caption">
          If these folders do not exist then you may need to create them.
        </Typography>
        <br />

        <Typography variant="caption">
          Folders should be named exactly: "LocalPrefabs" and "Mods"
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
