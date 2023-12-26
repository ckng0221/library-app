import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import BookDetails from './pages/BookDetails';
import Books from './pages/Books';
import { useEffect, useState } from 'react';
import { ICart } from './interfaces/cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import { ICustomer } from './interfaces/customer';
import { getCustomerById, getCustomers } from './api/customer-api';
import Borrowings from './pages/Borrowings';

function App() {
  const [cartItems, setCartItems] = useState<ICart[]>([]);
  const [customer, setCustomer] = useState<ICustomer>({
    _id: '',
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    getCustomers().then((res) => {
      console.log(res);

      // NOTE: POC only, just use the first customer
      getCustomerById(res.data[0]._id)
        .then((res) => {
          // console.log(data);

          return setCustomer(res.data);
        })
        .catch((error) => console.error(error));
    });
  }, []);

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
                <Checkout
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  customer={customer}
                />
              }
            />
            <Route path="account" element={<Account customer={customer} />} />
            <Route
              path="borrowings"
              element={<Borrowings customer={customer} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
