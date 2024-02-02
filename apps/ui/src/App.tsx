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
import { getCartsByCustomerId, getCustomerById } from './api/customer-api';
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

  // Cookie
  const [cookies, setCookie, removeCookie] = useCookies(['usertoken']);

  useEffect(() => {
    async function initialLoad() {
      // console.log('use effect called');
      if (cookies['usertoken']) {
        // Get customer ID from jwt verification
        const token: any = await tokenVerification({
          token: cookies['usertoken'],
        });
        const customerId = token?.data?.sub;

        // update customer data
        //update cart
        const customerPromise = getCustomerById(customerId);
        const cartsPromise = getCartsByCustomerId(customerId);

        const results = await Promise.all([customerPromise, cartsPromise]);
        setCustomer(results[0].data);
        setCartItems(results[1].data);
      }
    }
    initialLoad();
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
    // console.log('🚀 ~ App ~ prevLocation:', prevLocation);

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
            {/* Private */}
            <Route element={<ProtectedRoute isAllowed={!!customer._id} />}>
              <Route path="account" element={<Account customer={customer} />} />
              <Route
                path="borrowings"
                element={<Borrowings customer={customer} />}
              />
              <Route
                path="borrowings/:borrowingId"
                element={<BorrowingDetails />}
              />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
