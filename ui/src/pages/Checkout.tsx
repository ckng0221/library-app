import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from 'react';
import { ICart } from '../interfaces/cart';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { getCustomers } from '../api/customer-api';
import { ICustomer } from '../interfaces/customer';
import ModalComp from '../components/Modal';
import AlertComp from '../components/Alert';

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
  });
};

function Customer() {
  const [customer, setCustomer] = useState('');
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    setCustomer(event.target.value as string);
  };

  useEffect(() => {
    getCustomers()
      .then((data) => {
        setCustomer(data[0].name);

        return setCustomers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const CustomerItems = customers.map((customer) => {
    return (
      <MenuItem key={customer._id} value={customer.name}>
        {customer.name}
      </MenuItem>
    );
  });
  return (
    <FormControl sx={{ m: 1, minWidth: '10rem' }}>
      <InputLabel htmlFor="my-input">Customer Name</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={customer}
        label="Customer Name"
        onChange={handleChange}
      >
        {CustomerItems}
      </Select>
    </FormControl>
  );
}

interface IProps {
  cartItems: ICart[];
  setCartItems: (array: []) => void;
}

// function processCheckout

function Checkout(props: IProps) {
  const [show, setShow] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [body, setBody] = useState('Confirm to checkout?');
  const [snackOpen, setSnackOpen] = useState(false);

  const handleConfirm = () => {
    setShowLoading(true);
    setBody('Redirect to payment gateway...');
    setTimeout(() => {
      setTimeout(() => {
        setShow(false);
        setBody('Confirm to checkout?');
        setShowLoading(false);
        setSnackOpen(true);
        props.setCartItems([]);
      }, 1000);
      setBody('Processing payment...');
    }, 1000);
  };
  const handleShow = () => setShow(true);

  const ReturnItems = () => {
    if (props.cartItems.length <= 0) {
      return 'Your cart is empty';
    } else {
      return (
        <Container>
          <Row>
            <Customer />
          </Row>
          <br />
          <Row>
            <Col>
              <b>Title</b>
            </Col>
            <Col>
              <b>Quantity</b>
            </Col>
          </Row>
        </Container>
      );
    }
  };

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <ReturnItems />
          </ListGroup.Item>
          <ListItem cartItems={props.cartItems} />
        </ListGroup>
      </Card>

      <p></p>
      {props.cartItems.length > 0 && (
        <Button variant="contained" onClick={handleShow}>
          Checkout
        </Button>
      )}
      <ModalComp
        show={show}
        handleConfirm={handleConfirm}
        handleClose={() => setShow(false)}
        title="Checkout"
        body={body}
        confirmText="Confirm"
        showLoading={showLoading}
      />
      <AlertComp
        snackOpen={snackOpen}
        alertMessage="Payment completed!"
        setSnackOpen={setSnackOpen}
      />
    </>
  );
}

export default Checkout;
