import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { IBook } from '../interfaces/book';
import { Link } from 'react-router-dom';
import { getBooks } from '../components/api/book-api';

function BookTable() {
  const [books, setBooks] = useState<IBook[]>([
    { _id: '', author: '', title: '', isbn: '', published_date: '' },
  ]);

  useEffect(() => {
    getBooks()
      .then((data) => {
        // console.log(data);

        return setBooks(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const bookRows = books.map((book, index) => {
    return (
      <tr key={book._id}>
        <td>{index + 1}</td>
        <td>
          <Link to={`/books/${book._id}`}>{book.title}</Link>
        </td>
        <td>{book.author}</td>
        <td>{book.isbn}</td>
      </tr>
    );
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Author</th>
          <th>ISBN</th>
        </tr>
      </thead>
      <tbody>{bookRows}</tbody>
    </Table>
  );
}

function Books() {
  return <BookTable />;
}

export default Books;
