import AccountCircle from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Cart from '../components/Cart';
import DrawerComp from '../components/Drawer';
import Footer from '../components/Footer';
import { ICart } from '../interfaces/cart';
import libraryIcon from '/library-icon.png';
import AlertComp, { IAlertProps } from '../components/Alert';
import { CookieSetOptions } from 'universal-cookie';
import { ICustomer } from '../interfaces/customer';
import DialogComp from '../components/Dialog';

interface IProps {
  cartItems: ICart[];
  alertCompProps: IAlertProps;
  customer: ICustomer;
  setCustomer: React.Dispatch<React.SetStateAction<ICustomer>>;
  removeCookie: (name: 'usertoken', options?: CookieSetOptions) => void;
}

function MenuAppBar({
  cartItems,
  customer,
  setCustomer,
  removeCookie,
  alertCompProps,
}: {
  cartItems: IProps['cartItems'];
  customer: IProps['customer'];
  setCustomer: IProps['setCustomer'];
  removeCookie: IProps['removeCookie'];
  alertCompProps: IProps['alertCompProps'];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = useState({
    left: false,
  });
  // Logout dialog
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setCustomer({
      _id: '',
      name: '',
      email: '',
      address: '',
    });
    removeCookie('usertoken');
    // navigate('/');

    setAnchorEl(null);
    alertCompProps.setAlertMessage('Logged out!');
    alertCompProps.setSnackOpen(true);
    setOpenLogoutDialog(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() =>
                setOpenDrawer({
                  left: true,
                })
              }
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: '#FFF' }}>
                <img
                  src={libraryIcon}
                  alt="Library icon"
                  style={{ height: 30, width: 30 }}
                />
                &nbsp; Library App
              </Link>
            </Typography>
            {customer._id ? (
              <div>
                <Tooltip title="Checkout Cart">
                  <IconButton>
                    <Link to="checkout" id="checkout">
                      <Cart cartItems={cartItems} />
                    </Link>
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      navigate('/account');
                    }}
                  >
                    My Account
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/borrowings');
                    }}
                  >
                    My Borrowings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setOpenLogoutDialog(true);
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <Button variant="contained" color={'primary'} href={'/login'}>
                Sign in
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <DrawerComp
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        DrawerListComp={<DrawerList />}
      />
      <DialogComp
        show={openLogoutDialog}
        handleClose={() => {
          setOpenLogoutDialog(false);
        }}
        handleConfirm={handleLogout}
        title="Log out"
        confirmText="Confirm"
        body="Are you sure you want to log out?"
        showLoading={false}
      />
    </>
  );
}

const DrawerList = () => (
  <Box
    role="presentation"
    // onClick={toggleDrawer('left', false)}
    // onKeyDown={toggleDrawer('left', false)}
  >
    <List>
      <ListItem disablePadding>
        <Link id="home" to="/">
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem disablePadding>
        <Link id="books" to="/books">
          <ListItemButton>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary={'Books'} />
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
    <List>
      <ListItem disablePadding>
        <Link id="about" to="/about">
          <ListItemButton>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={'About'} />
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
    <List>
      <ListItem disablePadding>
        <Link id="admin" to="/admin">
          <ListItemButton>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary={'Admin'} />
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
  </Box>
);

const Layout = ({
  cartItems,
  alertCompProps,
  customer,
  setCustomer,
  removeCookie,
}: IProps) => {
  return (
    <>
      <div></div>
      <MenuAppBar
        cartItems={cartItems}
        customer={customer}
        setCustomer={setCustomer}
        removeCookie={removeCookie}
        alertCompProps={alertCompProps}
      />
      <AlertComp
        snackOpen={alertCompProps.snackOpen}
        setSnackOpen={alertCompProps.setSnackOpen}
        alertMessage={alertCompProps.alertMessage}
        setAlertMessage={alertCompProps.setAlertMessage}
        severity={alertCompProps.severity}
        setSeverity={alertCompProps.setSeverity}
        setAutoHideDuration={alertCompProps.setAutoHideDuration}
      />
      <p></p>
      <Outlet />
      <Footer position="fixed" />
    </>
  );
};

export default Layout;
