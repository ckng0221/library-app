import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';

interface IProps {
  show: boolean;
  handleConfirm: () => void;
  handleClose: () => void;
  title: string;
  body: string | ReactNode;
  confirmText: string;
  showLoading: boolean;
}

function DialogComp(props: IProps) {
  const {
    show,
    handleConfirm,
    handleClose,
    title,
    body,
    confirmText,
    showLoading,
  } = props;

  return (
    <Dialog
      open={show}
      onClose={!showLoading ? handleClose : () => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {showLoading && (
            <>
              <CircularProgress />
              <br />
            </>
          )}
          {!showLoading && body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={showLoading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} autoFocus disabled={showLoading}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogComp;
