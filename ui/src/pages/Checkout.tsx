import { useState } from 'react';
import { ICart } from '../interfaces/cart';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { ICustomer } from '../interfaces/customer';
import { Link as RouterLink } from 'react-router-dom';
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

interface IProps {
  cartItems: ICart[];
  setCartItems: (array: []) => void;
  customer: ICustomer;
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
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Cart</Typography>
      </Breadcrumbs>
      <br />

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
              <ListItem>Customer Name: {props.customer.name}</ListItem>
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
