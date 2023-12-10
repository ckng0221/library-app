import { Link, Outlet } from 'react-router-dom';
import bookIcon from '/book.png';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cart from '../components/Cart';

function NavBar(props) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Link to="">Library App</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link to="books">Books</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="checkout">
                <Cart cartItems={props.cartItems} />
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const Layout = (props) => {
  return (
    <>
      <div>
        <Link to="">
          <img src={bookIcon} className="logo" alt="Book icon" />
        </Link>
      </div>
      <NavBar cartItems={props.cartItems} />
      <p></p>
      <Outlet />
    </>
  );
};

export default Layout;
