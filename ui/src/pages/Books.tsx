import { useEffect, useState } from 'react';
import { IBook } from '../interfaces/book';
import { Link } from 'react-router-dom';
import { getBooks } from '../components/api/book-api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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

  const columns: GridColDef[] = [
    {
      field: 'num',
      headerName: '#',
      width: 10,
    },
    {
      field: 'title',
      headerName: 'Title',
      renderCell: (params) => {
        return <Link to={`/books/${params.id}`}>{params.formattedValue}</Link>;
      },
    },
    { field: 'author', headerName: 'Author' },
    { field: 'isbn', headerName: 'ISBN', width: 200 },
  ];

  const rows = books.map((book, index) => {
    return {
      id: book._id,
      num: index + 1,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    };
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 5, pageSize: 10 },
          },
        }}
        pageSizeOptions={[1, 10]}
      />
    </div>
  );
}

function Books() {
  return <BookTable />;
}

export default Books;
