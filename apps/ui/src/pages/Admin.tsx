import {
  AlertColor,
  Breadcrumbs,
  Button,
  Link,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { createBook, getBookById } from '../api/book-api';
import { createCustomer, getCustomerById } from '../api/customer-api';
import AlertComp from '../components/Alert';
import { useState } from 'react';

async function createInitialCustomer() {
  const payload = {
    _id: '658d8caff574e205de8c906c',
    name: 'Test customer',
    email: 'testcustomer@email.com',
    address: '123 street, USA.',
  };
  const customer = await getCustomerById(payload._id);
  if (customer.data) {
    // Skip if customer exists
    // console.log('customer exists!');
    return;
  } else {
    return createCustomer(payload);
  }
}

function createInitialBooks() {
  const payloads = [
    {
      _id: '658d8e3f6f3def5250abbaee',
      title: 'Test Book 1',
      author: 'Author 1',
      isbn: '978-3-16-148410-0',
      published_date: '2023-12-28',
    },
    {
      _id: '658d8e3f6f3def5250abbaf0',
      title: 'Test Book 2',
      author: 'Author 2',
      isbn: '978-3-16-148411-0',
      published_date: '2023-12-01',
    },
  ];
  const bookPromises = payloads.map(async (payload) => {
    const book = await getBookById(payload._id);
    if (book.data) {
      return;
    } else {
      return createBook(payload);
    }
  });
  return bookPromises;
}

async function createInitialData() {
  const customerPromise = createInitialCustomer();
  const booksPromises = createInitialBooks();
  const allPromises = [...booksPromises, customerPromise];
  return Promise.all(allPromises);
}

function Admin() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');

  async function handleCreateTestData() {
    const data = await createInitialData();
    const isEmpty = data.every((x) => x === undefined);
    if (isEmpty) {
      setAlertSeverity('warning');
      setAlertMessage('Intial data already exist, skip creating.');
    } else {
      setAlertSeverity('success');
      setAlertMessage('Done creating intial data for customer and books!');
    }
    setShowAlert(true);
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Admin</Typography>
      </Breadcrumbs>
      <Typography align="left">
        <br />
        To take note it requires some initial data to let the application work.
      </Typography>
      <Typography align="left">
        You could create some initial test data by clicking the button below:
      </Typography>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateTestData}
      >
        Create test data
      </Button>
      <AlertComp
        snackOpen={showAlert}
        setSnackOpen={setShowAlert}
        severity={alertSeverity}
        alertMessage={alertMessage}
      />
    </>
  );
}

export default Admin;
