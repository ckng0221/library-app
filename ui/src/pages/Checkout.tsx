import { useState } from 'react';
import { ICart } from '../interfaces/cart';
import {
  AlertColor,
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
import { createBorrowing } from '../api/borrowing-api';
import { IBorrowing } from '../interfaces/borrowing';
import { sleep } from '../utils/common';

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
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');

  function showAlert(alertMessage: string, alertSeverity: AlertColor) {
    setSnackOpen(true);
    setAlertMessage(alertMessage);
    setAlertSeverity(alertSeverity);
  }

  const handleConfirm = async () => {
    setShowLoading(true);

    // TODO: Create borrowing
    const borrowingBooks = props.cartItems.map((item) => {
      return {
        id: item.book_id,
        name: item.book_title,
        returned_date: null,
        quantity: item.quantity,
      };
    });

    const payload: IBorrowing = {
      customer_id: props.customer._id,
      customer_name: props.customer.name,
      books: borrowingBooks,
      is_payment_done: false,
    };

    try {
      const borrowing = await createBorrowing(payload);

      setBody(`Redirecting to payment gateway...`);
      await sleep(1000);

      setBody(`Proceeding payment for borrowing_id: ${borrowing.data._id}...`);
      await sleep(1000);

      // TODO: Call payment API after confirm

      setShowLoading(false);
      setShow(false);
      showAlert(String('Successfully check out!'), 'success');
    } catch (error) {
      console.error(error);
      setShowLoading(false);
      setShow(false);
      showAlert(String(error), 'error');
    }
    // console.log(borrowing);
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
        alertMessage={alertMessage}
        setSnackOpen={setSnackOpen}
        severity={alertSeverity}
      />
    </>
  );
}

export default Checkout;
