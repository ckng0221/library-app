import { ICart } from '../interfaces/cart';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function CartBadge({ count }: { count: number }) {
  return (
    <Badge badgeContent={count} color="primary">
      <ShoppingCartIcon color="action" />
    </Badge>
  );
}

function Cart(props: { cartItems: ICart[] }) {
  const cartItemCount = props.cartItems.length;

  return <CartBadge count={cartItemCount} />;
}

export default Cart;
