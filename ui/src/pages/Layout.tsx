import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import { ICart } from '../interfaces/cart';
import libraryIcon from '/library-icon.png';
interface IProps {
  cartItems: ICart[];
}

function MenuAppBar(props: IProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = useState({
    left: false,
  });

  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
                Library App
              </Link>
            </Typography>
            {
              <div>
                <IconButton>
                  <Link to="checkout" id="checkout">
                    <Cart cartItems={props.cartItems} />
                  </Link>
                </IconButton>
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
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
              </div>
            }
          </Toolbar>
        </AppBar>
      </Box>
      <DrawerComp
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        DrawerListComp={<DrawerList />}
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
  </Box>
);

const Layout = (props: IProps) => {
  return (
    <>
      <div>
        <Link to="">
          <img src={libraryIcon} className="logo" alt="Library icon" />
        </Link>
      </div>
      <MenuAppBar cartItems={props.cartItems} />
      <p></p>
      <Outlet />
    </>
  );
};

export default Layout;
