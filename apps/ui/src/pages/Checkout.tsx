import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  AlertColor,
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { sleep } from '@repo/common';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createBorrowing } from '../api/borrowing-api';
import { deleteCartById } from '../api/customer-api';
import { getPayments, makePaymentById } from '../api/payment-api';
import AlertComp from '../components/Alert';
import DialogComp from '../components/Dialog';
import { IBorrowing } from '../interfaces/borrowing';
import { ICart } from '../interfaces/cart';
import { ICustomer } from '../interfaces/customer';
import { IPayment } from '../interfaces/payment';

const ListItems = ({
  cartItems,
  setCartItems,
}: {
  cartItems: IProps['cartItems'];
  setCartItems: IProps['setCartItems'];
}) => {
  function handleRemoveCartItem(cartId: string) {
    const remainingCartItems = cartItems.filter((cart) => cart._id !== cartId);
    setCartItems(remainingCartItems);

    deleteCartById(cartId);

    // console.log(cartId);
  }

  return cartItems.map((item) => {
    return (
      <ListItem key={item._id}>
        <ListItemAvatar>
          <Avatar>
            <MenuBookIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.book_title}
          secondary={`Quantity : ${item.quantity}`}
        />
        <IconButton
          aria-label="Remove cart item"
          size="small"
          onClick={() => {
            handleRemoveCartItem(item._id);
          }}
        >
          <DeleteIcon fontSize="inherit" color="error" />
        </IconButton>
      </ListItem>
    );
  });
};

interface IProps {
  cartItems: ICart[];
  setCartItems: React.Dispatch<React.SetStateAction<ICart[]>>;
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

  // useEffect(() => {
  //   setPayment(payment);
  // }, [payment]);

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
      // await sleep(1000);
      // console.log(borrowing);

      let paymentData = [];
      let payments;
      let requestAttempts = 0;
      // Solve eventual consistency issue from queue
      while (
        requestAttempts < 10 &&
        (!paymentData || paymentData.length <= 0)
      ) {
        // console.log(`Sending request attempt ${requestAttempts}...`);
        payments = await getPayments({
          borrowing_id: String(borrowing.data._id),
        });
        // console.log(payments.data);

        paymentData = payments.data || [];
        requestAttempts++;
        await sleep(500);
      }
      if (paymentData.length > 0) {
        setPayment(payments.data[0]);
      } else {
        throw new Error('Failed to load payment data');
      }

      // console.log('payment_initial', payment);
      // console.log('payments', payments);

      await sleep(1000);
      // console.log('lala', props.cartItems);

      props.cartItems.map((cart) => {
        // console.log('cartid', cart._id);

        if (!cart._id) return;
        deleteCartById(cart?._id);
      });
      props.setCartItems([]);
      //delete cart in db
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
              <ListItems
                cartItems={props.cartItems}
                setCartItems={props.setCartItems}
              />
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
            Payment ID: {payment?._id}
            <br />
            Amount: $ {payment?.amount.toFixed(2)}
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
