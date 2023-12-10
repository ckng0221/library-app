import { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import ModalComp from './modal';

function BorrowingForm() {
  const [field, setField] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Form.Group as={Col} controlId="my_multiselect_field">
        <Form.Label>Books</Form.Label>
        <Form.Control
          as="select"
          multiple
          value={field}
          onChange={(e) =>
            setField(
              [].slice.call(e.target.selectedOptions).map((item) => item.value),
            )
          }
        >
          <option value="field1">Field 1</option>
          <option value="field2">Field 2</option>
          <option value="field3">Field 3</option>
        </Form.Control>
        <p></p>
        <Button onClick={handleShow}>Checkout</Button>
      </Form.Group>
      <ModalComp
        show={show}
        handleClose={handleClose}
        title="Checkout"
        body="Confirm to checkout?"
        confirmText="Confirm"
      />
    </>
  );
}

export default BorrowingForm;
