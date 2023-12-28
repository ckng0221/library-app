import { useEffect, useState } from 'react';
import { IBook } from '../interfaces/book';
import { Link as RouterLink } from 'react-router-dom';
import { getBooks } from '../api/book-api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Breadcrumbs, Link, Typography } from '@mui/material';

function BookTable() {
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    getBooks()
      .then((res) => {
        // console.log(data);

        return setBooks(res.data);
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
        return (
          <RouterLink to={`/books/${params.id}`}>
            {params.formattedValue}
          </RouterLink>
        );
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
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Books</Typography>
      </Breadcrumbs>
      <br />
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
    </>
  );
}

function Books() {
  return <BookTable />;
}

export default Books;
