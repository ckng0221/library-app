import { Types } from 'mongoose';
import { Customer } from '../schemas/customer.schema';
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
