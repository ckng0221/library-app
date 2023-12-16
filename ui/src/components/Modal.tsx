import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';

interface IProps {
  show: boolean;
  handleConfirm: () => void;
  handleClose: () => void;
  title: string;
  body: string;
  confirmText: string;
  showLoading: boolean;
}

function ModalComp(props: IProps) {
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
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showLoading && (
            <>
              <CircularProgress />
              <br />
            </>
          )}
          {body}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={showLoading}
          >
            {confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalComp;
