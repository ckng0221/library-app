import Badge from 'react-bootstrap/Badge';
import { FaCartShopping } from 'react-icons/fa6';
import { ICart } from '../interfaces/cart';

function CartBadge({ count }: { count: number }) {
  return (
    <Badge pill bg="danger">
      {count}
    </Badge>
  );
}

function Cart(props: { cartItems: ICart[] }) {
  const cartItemCount = props.cartItems.length;

  return (
    <>
      <FaCartShopping />
      {cartItemCount > 0 ? <CartBadge count={cartItemCount} /> : ''}
    </>
  );
}

export default Cart;
