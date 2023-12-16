import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import { getBookById } from '../api/book-api';
import { IBook } from '../interfaces/book';
import sampleBook from '/sample-book.webp';
import AlertComp from '../components/Alert';

interface IProps {
  addToCart: (bookId: string, bookTitle: string) => void;
  snackOpen: boolean;
  setSnackOpen: (arg: boolean) => void;
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
      <AlertComp
        alertMessage={`${book.title} added to cart!`}
        snackOpen={props.snackOpen}
        setSnackOpen={props.setSnackOpen}
      />
    </>
  );
}

export default BookDetails;
