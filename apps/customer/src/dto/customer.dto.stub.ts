import { Types } from 'mongoose';
import { Customer } from '../schemas/customer.schema';

export const CustomerDtoStub = (bookObj?: Partial<Customer>): Customer => {
  return {
    _id: new Types.ObjectId(),
    name: bookObj?.name || 'Test Name',
    email: bookObj?.email || 'test@email.com',
    address: bookObj?.address || 'test address.',
  };
};
