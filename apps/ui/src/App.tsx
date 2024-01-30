import './App.css';

import { AlertColor } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { tokenVerification } from './api/auth-api';
import { getCustomerById } from './api/customer-api';
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
import SignUp from './pages/Signup';

function App() {
  const [cartItems, setCartItems] = useState<ICart[]>([]);
  const [customer, setCustomer] = useState<ICustomer>({
    _id: '',
    name: '',
    email: '',
    address: '',
  });
  // Alert componnet
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessaage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const alertCompProps = {
    snackOpen: alertOpen,
    alertMessage: alertMessaage,
    setAlertMessage: setAlertMessage,
    severity: alertSeverity,
    setSeverity: setAlertSeverity,
    setSnackOpen: setAlertOpen,
    autoHideDuration: autoHideDuration,
    setAutoHideDuration: setAutoHideDuration,
  };

  // console.log('userId', userId);
  // Cookie
  const [cookies, setCookie, removeCookie] = useCookies(['usertoken']);

  useEffect(() => {
    if (cookies['usertoken']) {
      // Get customer ID from jwt verification
      tokenVerification({ token: cookies['usertoken'] }).then((res) => {
        const customerId = res.data.sub;

        getCustomerById(customerId)
          .then((res) => {
            // console.log(res.data);

            return setCustomer(res.data);
          })
          .catch((error) => console.error(error));
      });
    }
  }, [cookies]);

  const ProtectedRoute = ({
    isAllowed,
    redirectPath = `/login`,
    children,
  }: {
    isAllowed: boolean;
    redirectPath?: string;
    children?: React.ReactNode;
  }) => {
    const prevLocation = useLocation();

    // FIXME: Not a good approach, as usertoken is not verified.
    // Need to click twice
    if (!isAllowed && !cookies['usertoken']) {
      return (
        <Navigate
          to={`${redirectPath}?redirectTo=${prevLocation.pathname}`}
          replace
        />
      );
    }

    return children ? children : <Outlet />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                cartItems={cartItems}
                alertCompProps={alertCompProps}
                customer={customer}
                setCustomer={setCustomer}
                removeCookie={removeCookie}
              />
            }
          >
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route
              path="books/:bookId"
              element={
                <BookDetails
                  customer={customer}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />
            <Route
              path="login"
              element={
                <Login
                  setAlertOpen={setAlertOpen}
                  setAlertMessage={setAlertMessage}
                  setCookie={setCookie}
                />
              }
            />
            <Route
              path="signup"
              element={
                <SignUp alertCompProps={alertCompProps} setCookie={setCookie} />
              }
            />
            <Route path="about" element={<About />} />

            {/* Private */}
            <Route path="account" element={<Account customer={customer} />} />
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
            <Route element={<ProtectedRoute isAllowed={!!customer._id} />}>
              <Route
                path="borrowings"
                element={<Borrowings customer={customer} />}
              />
              <Route
                path="borrowings/:borrowingId"
                element={<BorrowingDetails />}
              />
            </Route>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
