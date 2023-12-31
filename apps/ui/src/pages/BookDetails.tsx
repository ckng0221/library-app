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
import { useParams } from 'react-router-dom';
import { getBookById } from '../api/book-api';
import { IBook } from '../interfaces/book';
import sampleBook from '/sample-book.webp';
import { ICart } from '../interfaces/cart';
import AlertComp from '../components/Alert';
import { Link as RouterLink } from 'react-router-dom';

interface IProps {
  cartItems: ICart[];
  setCartItems: (array: ICart[]) => void;
}

function BookDetails(props: IProps) {
  const { bookId } = useParams();
  const [snackOpen, setSnackOpen] = useState(false);

  if (!bookId) throw Error();

  const [book, setBook] = useState<IBook>({
    _id: '',
    author: '',
    title: '',
    isbn: '',
    published_date: '',
  });

  function addToCart(bookId: string, bookTitle: string) {
    const book = props.cartItems.find((item) => item.book_id === bookId);
    if (book) {
      book.quantity++;
    } else {
      props.setCartItems([
        ...props.cartItems,
        { book_id: bookId, book_title: bookTitle, quantity: 1 },
      ]);
    }
    setSnackOpen(true);
    // console.log(cartItems);
  }

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
