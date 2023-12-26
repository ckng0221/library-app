import {
  Avatar,
  Breadcrumbs,
  Card,
  CardContent,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getBorrowings } from '../api/borrowing-api';
import { IBorrowing } from '../interfaces/borrowing';
import { ICustomer } from '../interfaces/customer';
import dayjs from 'dayjs';
import TableComp from '../components/Table';
import AutoStoriesTwoToneIcon from '@mui/icons-material/AutoStoriesTwoTone';

const ListItems = ({ borrowings }: { borrowings: IBorrowing[] }) => {
  return borrowings.map((borrowing) => {
    const borrowed_date = dayjs(borrowing.borrowed_date).format('YYYY-MM-DD');
    const columns = [
      { field: 'index', headerName: 'No.' },
      { field: 'name', headerName: 'Book Title' },
      { field: 'quantity', headerName: 'Quantity' },
    ];

    return (
      <>
        <ListItem key={borrowing._id}>
          <ListItemAvatar>
            <Avatar>
              <AutoStoriesTwoToneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`ID: ${borrowing._id?.slice(0, 8)}`}
            secondary={`Books: `}
          />
          <ListItemText secondary={`Date: ${borrowed_date}`} />
        </ListItem>
        <TableComp
          rows={borrowing.books.map((book, index) => {
            return { index: index + 1, ...book };
          })}
          columns={columns}
        />
        <hr />
      </>
    );
  });
};

interface IProps {
  customer: ICustomer;
}

// function processCheckout

function Borrowings(props: IProps) {
  const [borrowings, setBorrowings] = useState<IBorrowing[]>([]);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const customer_id = props.customer._id;
    if (!customer_id) return;
    getBorrowings({ customer_id })
      .then((res) => {
        setBorrowings(res.data);
        setShowLoading(false);
      })
      .catch((error) => console.error(error));
  }, [props.customer._id]);

  return (
    <>
      <br />
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">My Borrowings</Typography>
      </Breadcrumbs>
      <br />

      <Card sx={{ minWidth: 600 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            My Borrowings
          </Typography>
        </CardContent>
        {showLoading && <CircularProgress />}
        {borrowings.length > 0 && !showLoading && (
          <CardContent>
            Customer Name: {props.customer.name}
            {
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItems borrowings={borrowings} />
              </List>
            }
          </CardContent>
        )}
        {borrowings.length <= 0 && !showLoading && (
          <CardContent>"You don't have any borrowings"</CardContent>
        )}
      </Card>
    </>
  );
}

export default Borrowings;
