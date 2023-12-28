import AutoStoriesTwoToneIcon from '@mui/icons-material/AutoStoriesTwoTone';
import {
  Avatar,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getBorrowings } from '../api/borrowing-api';
import CopyToClipboardIcon from '../components/CopyToClipboard';
import TableComp from '../components/Table';
import { IBorrowing } from '../interfaces/borrowing';
import { ICustomer } from '../interfaces/customer';
import { paymentSocket } from '../utils/socket';

const ListItems = ({ borrowings }: { borrowings: IBorrowing[] }) => {
  const columns = [
    { field: 'index', headerName: 'No.' },
    { field: 'name', headerName: 'Book Title' },
    { field: 'quantity', headerName: 'Quantity' },
  ];

  return borrowings.map((borrowing) => {
    const borrowed_date = dayjs(borrowing.borrowed_date).format('YYYY-MM-DD');

    const borrowingBooks = borrowing.books.map((book, index) => {
      return { index: index + 1, ...book };
    });
    const paymentStatus: any = {
      text: borrowing.is_payment_done ? 'Successful' : 'Pending',
      color: borrowing.is_payment_done ? 'success' : 'warning',
    };
    // console.log(borrowingBooks);

    return (
      <div key={borrowing._id}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AutoStoriesTwoToneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                ID: &nbsp;
                <Link
                  underline="always"
                  color="inherit"
                  to={`/borrowings/${borrowing._id}`}
                  component={RouterLink}
                >
                  {borrowing._id?.slice(0, 8)}
                </Link>
                &nbsp;
                <CopyToClipboardIcon text={borrowing._id} />
              </>
            }
            secondary={`Books: `}
          />
          <ListItemText secondary={`Date: ${borrowed_date}`} />
          <ListItemText
            secondary={
              <>
                Payment status: &nbsp;&nbsp;
                <Chip
                  label={paymentStatus.text}
                  color={paymentStatus.color}
                  size="small"
                  component="span"
                />
              </>
            }
          />
        </ListItem>
        <TableComp rows={borrowingBooks} columns={columns} />
        <hr />
      </div>
    );
  });
};

interface IProps {
  customer: ICustomer;
}

// function processCheckout

function Borrowings(props: IProps) {
  const [borrowings, _setBorrowings] = useState<IBorrowing[]>([]);
  const borrowingsRef = useRef(borrowings);
  const setBorrowings = (data: any) => {
    borrowingsRef.current = data;
    _setBorrowings(data);
  };
  const [showLoading, setShowLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const customer_id = props.customer._id;

  useEffect(() => {
    getBorrowings({ customer_id })
      .then((res) => {
        setBorrowings(res.data);
        setShowLoading(false);
      })
      .catch((error) => console.error(error));
  }, [customer_id]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onPaymentDone(message: any) {
      console.log('payment_done', message);
      if (message.status === 'success') {
        const objIndex = borrowingsRef.current.findIndex(
          (obj) => obj._id == message.borrowing_id,
        );

        // console.log('lala', borrowings);
        // console.log(objIndex);

        borrowingsRef.current[objIndex].is_payment_done = true;
        const updatedBorrowings = borrowingsRef.current;

        setBorrowings((prev: any) => [...updatedBorrowings]);

        // console.log(updatedBorrowings);
      }
    }

    paymentSocket.on('connected', onConnect);
    paymentSocket.on('disconnected', onDisconnect);
    paymentSocket.on('payment_done', onPaymentDone);

    return () => {
      paymentSocket.off('connected', onConnect);
      paymentSocket.off('disconnected', onDisconnect);
      paymentSocket.off('payment_done', onPaymentDone);
    };
  }, []);

  return (
    <>
      <br />
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Borrowings</Typography>
      </Breadcrumbs>
      <br />

      <Card sx={{ minWidth: 800 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            My Borrowings
          </Typography>
          {/* <Badge
            badgeContent={1}
            color={isConnected ? 'success' : 'error'}
            variant="dot"
          ></Badge> */}
        </CardContent>
        {showLoading && <CircularProgress />}
        {borrowings.length > 0 && !showLoading && (
          <CardContent>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItems borrowings={borrowings} />
            </List>
          </CardContent>
        )}
        {borrowings.length <= 0 && !showLoading && (
          <CardContent>You don't have any borrowings</CardContent>
        )}
      </Card>
    </>
  );
}

export default Borrowings;
