import { Types } from 'mongoose';
import { Customer, CustomerCart } from '../schemas/customer.schema';
import { v4 as uuidv4 } from 'uuid';

export const CustomerDtoStub = (cutomerObj?: Partial<Customer>): Customer => {
  const emailRandom = `${uuidv4().slice(0, 8)}@email.com`;

  return {
    _id: new Types.ObjectId(),
    name: cutomerObj?.name || 'Test Name',
    email: cutomerObj?.email || emailRandom,
    address: cutomerObj?.address || 'test address.',
  };
};

export const CustomerCartDtoStub = (
  cutomerCartObj?: Partial<CustomerCart>,
): CustomerCart => {
  return {
    _id: new Types.ObjectId(),
    customer: cutomerCartObj?.customer || new Types.ObjectId(),
    book_id: cutomerCartObj?.book_id || new Types.ObjectId(),
    book_title: cutomerCartObj?.book_title || 'Test book',
    quantity: cutomerCartObj?.quantity || 1,
  };
};
