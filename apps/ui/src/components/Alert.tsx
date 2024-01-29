import { Alert, Snackbar, Stack } from '@mui/material';
import { SyntheticEvent } from 'react';

export interface IAlertProps {
  snackOpen: boolean;
  alertMessage: string;
  setAlertMessage?: React.Dispatch<React.SetStateAction<string>>;
  severity: AlertColor;
  setSnackOpen: (arg: boolean) => void;
  autoHideDuration?: number;
}

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

export default function AlertComp(props: IAlertProps) {
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
          severity={props.severity}
          sx={{ width: '100%' }}
        >
          {props.alertMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
