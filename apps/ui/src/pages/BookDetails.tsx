import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBookById } from '../api/book-api';
import { IBook } from '../interfaces/book';
import sampleBook from '/sample-book.webp';
import { ICart } from '../interfaces/cart';
import AlertComp from '../components/Alert';
import { Link as RouterLink } from 'react-router-dom';
import { ICustomer } from '../interfaces/customer';
import { createCart, updateCartById } from '../api/customer-api';

interface IProps {
  customer: ICustomer;
  cartItems: ICart[];
  setCartItems: (array: ICart[]) => void;
}

function BookDetails(props: IProps) {
  const { bookId } = useParams();
  const [snackOpen, setSnackOpen] = useState(false);
  const navigate = useNavigate();
  const prevLocation = useLocation();

  if (!bookId) throw Error();

  const [book, setBook] = useState<IBook>({
    _id: '',
    author: '',
    title: '',
    isbn: '',
    published_date: '',
  });

  async function addToCart(bookId: string, bookTitle: string) {
    if (!props.customer?._id) {
      // navigate('/login');
      // console.log(prevLocation);
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
    const cart = props.cartItems.find((item) => item.book_id === bookId);
    console.log(cart);

    if (cart?._id) {
      cart.quantity++;
      //
      await updateCartById(cart?._id, { quantity: cart.quantity });
    } else {
      const cartItem = {
        book_id: bookId,
        book_title: bookTitle,
        customer: props.customer?._id,
        quantity: 1,
      };
      const cartItemRes = await createCart(cartItem);
      // console.log(cartItemRes);

      props.setCartItems([...props.cartItems, cartItemRes.data]);
    }

    setSnackOpen(true);
  }
  // console.log(cartItems);

  useEffect(() => {
    getBookById(bookId)
      .then((res) => {
        // console.log(data);

        return setBook(res.data);
      })
      .catch((error) => console.error(error));
  }, [bookId]);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/books"
          component={RouterLink}
        >
          Books
        </Link>
        <Typography color="text.primary">{book.title}</Typography>
      </Breadcrumbs>
      <br />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <CardMedia
              component="img"
              height="200"
              image={sampleBook}
              alt="Book image"
            />
          </Typography>
          <br />
          <Typography gutterBottom variant="h5" component="div">
            {book.title}
          </Typography>
          <Typography>Author: {book.author}</Typography>
          <Typography>Published Date: {book.published_date}</Typography>
          <Typography>ISBN: {book.isbn}</Typography>
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
              <Button
                variant="contained"
                onClick={() => addToCart(book._id, book.title)}
              >
                Add to cart &nbsp;
                <AddShoppingCartIcon />
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      <AlertComp
        alertMessage={`${book.title} added to cart!`}
        snackOpen={snackOpen}
        setSnackOpen={setSnackOpen}
        severity="success"
      />
    </>
  );
}

export default BookDetails;
