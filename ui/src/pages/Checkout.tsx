import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ICart } from '../interfaces/cart';
import ModalComp from '../components/modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ListItem = ({ cartItems }: { cartItems: ICart[] }) => {
  return cartItems.map((item) => {
    return (
      <ListGroup.Item>
        <Container>
          <Row>
            <Col>{item.book_title}</Col>
            <Col>{item.quantity}</Col>
          </Row>
        </Container>
      </ListGroup.Item>
    );
    return;
  });
};

function Checkout(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Container>
              <Row>
                <Col>
                  <b>Title</b>
                </Col>
                <Col>
                  <b>Quantity</b>
                </Col>
              </Row>
            </Container>
          </ListGroup.Item>
          <ListItem cartItems={props.cartItems} />
        </ListGroup>
      </Card>

      <p></p>
      <Button onClick={handleShow}>Checkout</Button>

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

export default Checkout;
