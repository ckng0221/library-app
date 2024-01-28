import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getCustomerById, getCustomers } from './api/customer-api';
import { ICart } from './interfaces/cart';
import { ICustomer } from './interfaces/customer';
import About from './pages/About';
import Account from './pages/Account';
import Admin from './pages/Admin';
import BookDetails from './pages/BookDetails';
import Books from './pages/Books';
import BorrowingDetails from './pages/BorrowingDetails';
import Borrowings from './pages/Borrowings';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Login from './pages/Login';

function App() {
  const [cartItems, setCartItems] = useState<ICart[]>([]);
  const [customer, setCustomer] = useState<ICustomer>({
    _id: '',
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    // NOTE: POC only, shouldn't call all customers.
    getCustomers().then((res) => {
      // console.log(res);
      const fakeCustomerId = res.data?.[0]._id;

      if (!fakeCustomerId) {
        const errorMsg =
          'Customer not found! Create a initial data at the admin page first';
        console.error(errorMsg);
        // alert(errorMsg);
        // throw new Error('Customer not found!');
      }

      // NOTE: POC only, just use the first customer.
      getCustomerById(fakeCustomerId)
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
            <Route
              path="borrowings/:borrowingId"
              element={<BorrowingDetails />}
            />
            <Route path="about" element={<About />} />
            <Route path="admin" element={<Admin />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
