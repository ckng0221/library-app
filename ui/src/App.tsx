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
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />
            <Route
              path="checkout"
              element={
                <Checkout cartItems={cartItems} setCartItems={setCartItems} />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
