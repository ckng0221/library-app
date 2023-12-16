import { Alert, Snackbar, Stack } from '@mui/material';
import { SyntheticEvent } from 'react';

interface IProp {
  snackOpen: boolean;
  alertMessage: string;
  setSnackOpen: (arg: boolean) => void;
  autoHideDuration?: number;
}

export default function AlertComp(props: IProp) {
  const handleCloseSnack = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setSnackOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={props.snackOpen}
        autoHideDuration={props.autoHideDuration || 2000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity="success"
          sx={{ width: '100%' }}
        >
          {props.alertMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
