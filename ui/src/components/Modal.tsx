import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface IProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  body: string;
  confirmText: string;
}

function ModalComp(props: IProps) {
  const { show, handleClose, title, body, confirmText } = props;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            {confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalComp;
