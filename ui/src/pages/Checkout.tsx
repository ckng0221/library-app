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
import { getPayments, makePaymentById } from '../api/payment-api';
import { IPayment } from '../interfaces/payment';

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
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDialogLoading, setPaymentDialogLoading] = useState(false);
  const [payment, setPayment] = useState<IPayment>({
    _id: '',
    borrowing_id: '',
    amount: 0,
  });

  function showAlert(alertMessage: string, alertSeverity: AlertColor) {
    setSnackOpen(true);
    setAlertMessage(alertMessage);
    setAlertSeverity(alertSeverity);
  }

  const handleConfirm = async () => {
    setShowLoading(true);

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
      setBody(`Creating borrowing...`);

      const borrowing = await createBorrowing(payload);

      setBody(`Redirecting to payment gateway...`);
      const payments = await getPayments({
        borrowing_id: String(borrowing.data._id),
      });
      setPayment(payments.data[0]);

      await sleep(1000);

      props.setCartItems([]);
      setShowLoading(false);
      setShow(false);
      setPaymentDialogOpen(true);
    } catch (error) {
      console.error(error);
      setShowLoading(false);
      setShow(false);
      showAlert(String(error), 'error');
    }
    // console.log(borrowing);
  };
  const handleShow = () => setShow(true);

  // console.log('id', payment_id);

  async function handleConfirmPayment(payment_id: string) {
    setBody(`Making payment for payment_id: ${payment_id}...`);

    setPaymentDialogLoading(true);
    await makePaymentById(payment_id);
    setPaymentDialogLoading(false);
    setPaymentDialogOpen(false);

    showAlert(String('Successfully checked out!'), 'success');
  }

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
      <DialogComp
        show={paymentDialogOpen}
        title="Payment Gateway"
        body={
          <>
            Payment ID: {payment._id}
            <br />
            Amount: $ {payment.amount.toFixed(2)}
          </>
        }
        showLoading={paymentDialogLoading}
        handleClose={() => setPaymentDialogOpen(false)}
        handleConfirm={() => {
          return handleConfirmPayment(payment._id);
        }}
        confirmText="Confirm payment"
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
