import { Types } from 'mongoose';
import { Borrowing } from '../schemas/borrowing.schema';

export const BorrowingDtoStub = (
  borrowingObj?: Partial<Borrowing>,
): Borrowing => {
  return {
    _id: new Types.ObjectId(),
    customer_id: new Types.ObjectId(),
    customer_name: borrowingObj?.customer_name || 'test-customer',
    books: borrowingObj?.books || [
      { id: new Types.ObjectId(), name: 'test-book', returned_date: null },
    ],
    borrowed_date: borrowingObj?.borrowed_date || new Date(),
    closed_date: borrowingObj?.closed_date || null,
    is_active: borrowingObj?.is_active || true,
    is_payment_done: borrowingObj?.is_payment_done || false,
  };
};
