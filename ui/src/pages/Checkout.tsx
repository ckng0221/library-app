import { useEffect, useState } from 'react';
import { ICart } from '../interfaces/cart';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { getCustomers } from '../api/customer-api';
import { ICustomer } from '../interfaces/customer';
import DialogComp from '../components/Dialog';
import AlertComp from '../components/Alert';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const ListItems = ({ cartItems }: { cartItems: ICart[] }) => {
  return cartItems.map((item) => {
    return (
      <ListItem key={item.book_id}>
        <ListItemAvatar>
          <Avatar>
            <MenuBookIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.book_title}
          secondary={`Quantity : ${item.quantity}`}
        />
      </ListItem>
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
  const [body, setBody] = useState('Confirm to checkout your cart?');
  const [snackOpen, setSnackOpen] = useState(false);

  const handleConfirm = () => {
    setShowLoading(true);
    setBody('Redirect to payment gateway...');
    setTimeout(() => {
      setTimeout(() => {
        setShow(false);
        setBody('Confirm to checkout your cart?');
        setShowLoading(false);
        setSnackOpen(true);
        props.setCartItems([]);
      }, 1000);
      setBody('Processing payment...');
    }, 1000);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Card sx={{ minWidth: 400 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Checkout Cart
          </Typography>
        </CardContent>
        <CardContent>
          {props.cartItems.length > 0 ? (
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            >
              <Customer />
              <ListItems cartItems={props.cartItems} />
            </List>
          ) : (
            'Your cart is empty'
          )}
        </CardContent>
      </Card>

      <p></p>
      {props.cartItems.length > 0 && (
        <Button variant="contained" onClick={handleShow}>
          Checkout
        </Button>
      )}
      <DialogComp
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
