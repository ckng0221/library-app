export interface IPayment {
  _id: string;
  borrowing_id: string;
  amount: number;
  created_date?: string;
  payment_date?: string;
}

export interface IPaymentDone {
  payment_id: string;
  borrowing_id: string;
  status: 'success' | 'failed';
}
