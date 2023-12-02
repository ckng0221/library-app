import { Types } from 'mongoose';
import { Payment } from '../schemas/payment.schema';

export const PaymentDtoStub = (paymentObj?: Partial<Payment>): Payment => {
  return {
    _id: new Types.ObjectId(),
    borrowing_id: paymentObj?.borrowing_id || new Types.ObjectId(),
    amount: paymentObj?.amount || 100,
    payment_date: paymentObj?.payment_date || new Date(),
  };
};
