import { ChipOwnProps } from '@mui/material';

export interface IBorrowingBook {
  id: string;
  name: string;
  returned_date: null | Date;
}

export interface IBorrowing {
  _id?: string;
  customer_id: string;
  customer_name: string;
  books: IBorrowingBook[];
  is_payment_done?: boolean;
  borrowed_date?: Date;
}

export interface IPaymentStatus<
  T extends ChipOwnProps['color'] = ChipOwnProps['color'],
> {
  text: string;
  color: T;
}
