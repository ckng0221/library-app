import PaymentIcon from '@mui/icons-material/Payment';
import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getBorrowingById } from '../api/borrowing-api';
import AlertComp from '../components/Alert';
import DialogComp from '../components/Dialog';
import TableComp from '../components/Table';
import { IBorrowing } from '../interfaces/borrowing';
import sampleBook from '/sample-book.webp';
import { getPayments, makePaymentById } from '../api/payment-api';
import { IPayment } from '../interfaces/payment';
import { paymentSocket } from '../utils/socket';
import CopyToClipboardIcon from '../components/CopyToClipboard';
import BackdropComp from '../components/Backdrop';

function BorrowingDetails() {
  const { borrowingId } = useParams();
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [paymentDialogLoading, setPaymentDialogLoading] = useState(false);
  const [borrowing, _setBorrowing] = useState<IBorrowing>({
    _id: '',
    books: [],
    borrowed_date: new Date(),
    customer_id: '',
    customer_name: '',
    is_payment_done: false,
  });
  const borrowingRef = useRef(borrowing);
  const setBorrowing = (data: any) => {
    borrowingRef.current = data;
    _setBorrowing(data);
  };
  const [payment, setPayment] = useState<IPayment>({
    _id: '',
    borrowing_id: '',
    amount: 0,
  });
  const [paymentDone, setPaymentDone] = useState(false);

  if (!borrowingId) throw Error();

  useEffect(() => {
    async function loadData() {
      const res = await getBorrowingById(String(borrowingId));
      setBorrowing(res.data);

      const payments = await getPayments({
        borrowing_id: String(borrowingId),
      });
      setPayment(payments.data[0]);
      setIsFetchingData(false);
    }

    loadData();
  }, [borrowingId]);

  useEffect(() => {
    function onPaymentDone(message: any) {
      console.log('payment_done', message);
      if (message.status === 'success') {
        // console.log('before', borrowingRef.current);

        borrowingRef.current.is_payment_done = true;
        const updatedBorrowing = borrowingRef.current;
        setBorrowing((prev: any) => updatedBorrowing);
        setPaymentDone(() => true);

        // console.log('borrowing', borrowing);
        // console.log('after', updatedBorrowing);
      }
    }
    paymentSocket.on('payment_done', onPaymentDone);

    return () => {
      paymentSocket.off('payment_done', onPaymentDone);
    };
  }, []);

  const borrowed_date = dayjs(borrowing.borrowed_date).format(
    'YYYY-MM-DD hh:mm A',
  );
  const columns = [
    { field: 'index', headerName: 'No.' },
    { field: 'name', headerName: 'Book Title' },
    { field: 'quantity', headerName: 'Quantity' },
  ];

  const borrowingBooks = borrowing.books.map((book, index) => {
    return { index: index + 1, ...book };
  });
  const paymentStatus: any = {
    text: borrowing.is_payment_done || paymentDone ? 'Successful' : 'Pending',
    color: borrowing.is_payment_done || paymentDone ? 'success' : 'warning',
  };

  function makePaymentDialog() {
    // setSnackOpen(true);
    setDialogOpen(true);
    setDialogLoading(true);
    setTimeout(() => {
      setDialogOpen(false);
      setDialogLoading(false);
      setPaymentDialogOpen(true);
    }, 1000);
  }

  async function handleConfirmPayment(payment_id: string) {
    setPaymentDialogLoading(true);
    await makePaymentById(payment_id);
    setPaymentDialogLoading(false);
    setPaymentDialogOpen(false);
    setSnackOpen(true);
  }

  const BorrowingDetailsComp = () => {
    return (
      <>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" to="/" component={RouterLink}>
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            to="/borrowings"
            component={RouterLink}
          >
            Borrowings
          </Link>
          <Typography color="text.primary">
            {borrowing._id?.slice(0, 8)}
          </Typography>
        </Breadcrumbs>
        <br />
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              <CardMedia
                component="img"
                height="200"
                image={sampleBook}
                alt="Book image"
              />
            </Typography>
            <br />
            <Typography>
              Borrowing ID: {borrowing._id}
              <CopyToClipboardIcon text={borrowing._id} />
            </Typography>
            <Typography>Borrowing Date: {borrowed_date}</Typography>
            <Typography>
              Payment ID: {payment._id}
              <CopyToClipboardIcon text={payment._id} />
            </Typography>
            <Typography>
              Payment Amount: ${payment.amount.toFixed(2)}
            </Typography>
            <Typography>
              Payment status:&nbsp;
              <Chip
                label={paymentStatus.text}
                color={paymentStatus.color}
                size="small"
                component="span"
              />
            </Typography>

            <br />
            <TableComp rows={borrowingBooks} columns={columns} />
          </CardContent>
          <CardActions>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={5}>
                {!borrowing.is_payment_done && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={makePaymentDialog}
                  >
                    Make Payment &nbsp;
                    <PaymentIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardActions>
        </Card>
        <DialogComp
          show={dialogOpen}
          title=""
          body="Redirecting to payment gateway..."
          showLoading={dialogLoading}
          handleClose={() => {}}
          handleConfirm={() => {}}
          confirmText=""
        />
        {/* Payment Dialog */}
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
          alertMessage={`Payment done for ${borrowing._id}!`}
          snackOpen={snackOpen}
          setSnackOpen={setSnackOpen}
          severity="success"
        />
      </>
    );
  };

  return (
    <>{isFetchingData ? <CircularProgress /> : <BorrowingDetailsComp />}</>
  );
}

export default BorrowingDetails;
