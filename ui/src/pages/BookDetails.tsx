import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import { getBookById } from '../api/book-api';
import { IBook } from '../interfaces/book';
import sampleBook from '/sample-book.webp';
import AlertComp from '../components/Alert';
import { ICart } from '../interfaces/cart';

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
      .then((data) => {
        // console.log(data);

        return setBook(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Card style={{ width: '20rem' }}>
        <Card.Img variant="top" src={sampleBook} />
        <Card.Body>
          <Card.Title>{book.title}</Card.Title>
          <Card.Text>Author: {book.author}</Card.Text>
          <Card.Text>Published Date: {book.published_date}</Card.Text>
          <Card.Text>ISBN: {book.isbn}</Card.Text>
          <Button
            variant="contained"
            onClick={() => addToCart(book._id, book.title)}
          >
            Add to cart &nbsp;
            <AddShoppingCartIcon />
          </Button>
        </Card.Body>
      </Card>
      <AlertComp
        alertMessage={`${book.title} added to cart!`}
        snackOpen={snackOpen}
        setSnackOpen={setSnackOpen}
      />
    </>
  );
}

export default BookDetails;
