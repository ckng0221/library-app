import { Types } from 'mongoose';
import { Customer } from '../schemas/customer.schema';

export const CustomerDtoStub = (cutomerObj?: Partial<Customer>): Customer => {
  return {
    _id: new Types.ObjectId(),
    name: cutomerObj?.name || 'Test Name',
    email: cutomerObj?.email || 'test@email.com',
    address: cutomerObj?.address || 'test address.',
  };
};
