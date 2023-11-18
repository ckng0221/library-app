import { Types } from 'mongoose';
import { Customer } from '../schemas/customer.schema';

export const CustomerDtoStub = (name: string = 'Test name'): Customer => {
  return {
    _id: new Types.ObjectId(),
    name: name,
    email: 'test@email.com',
    address: 'test address.',
  };
};
