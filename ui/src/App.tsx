import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import BookDetails from './pages/BookDetails';
import Books from './pages/Books';
import { useState } from 'react';
import { ICart } from './interfaces/cart';
import Checkout from './pages/Checkout';

function App() {
  const [cartItems, setCartItems] = useState<ICart[]>([]);

  function addToCart(bookId: string, bookTitle: string) {
    const book = cartItems.find((item) => item.book_id === bookId);
    if (book) {
      book.quantity++;
    } else {
      setCartItems([
        ...cartItems,
        { book_id: bookId, book_title: bookTitle, quantity: 1 },
      ]);
    }
    setSnackOpen(true);
    // console.log(cartItems);
  }

  const [snackOpen, setSnackOpen] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout cartItems={cartItems} />}>
            <Route index element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route
              path="books/:bookId"
              element={
                <BookDetails
                  addToCart={addToCart}
                  snackOpen={snackOpen}
                  setSnackOpen={setSnackOpen}
                />
              }
            />
            <Route
              path="checkout"
              element={<Checkout cartItems={cartItems} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
