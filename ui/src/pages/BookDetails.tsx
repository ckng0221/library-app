import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Alert, Button, Snackbar, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import { getBookById } from '../components/api/book-api';
import { IBook } from '../interfaces/book';
import sampleBook from '/sample-book.webp';

interface IProps {
  addToCart: (bookId: string, bookTitle: string) => void;
  snackOpen: boolean;
  handleCloseSnack: (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => void;
}

function BookDetails(props: IProps) {
  const { bookId } = useParams();

  if (!bookId) throw Error();

  const [book, setBook] = useState<IBook>({
    _id: '',
    author: '',
    title: '',
    isbn: '',
    published_date: '',
  });

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
            onClick={() => props.addToCart(book._id, book.title)}
          >
            Add to cart &nbsp;
            <AddShoppingCartIcon />
          </Button>
        </Card.Body>
      </Card>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          open={props.snackOpen}
          autoHideDuration={1000}
          onClose={props.handleCloseSnack}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={props.handleCloseSnack}
            severity="success"
            sx={{ width: '100%' }}
          >
            "{book.title}" added to cart!
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}

export default BookDetails;
