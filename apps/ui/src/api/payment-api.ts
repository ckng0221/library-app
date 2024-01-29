import axios from './api';

const BASE_URL = import.meta.env.VITE_PAYMENT_API_BASE_URL;
const resource = '/api/payment/payments';
const url = `${BASE_URL}${resource}`;

export async function getPayments({ borrowing_id }: { borrowing_id: string }) {
  const endpoint = url;

  return await axios.get(endpoint, {
    params: { borrowing_id },
  });
}

export async function getPaymentById(id: string) {
  const endpoint = `${url}/${id}`;
  return await axios.get(endpoint);
}

export async function makePaymentById(id: string) {
  const endpoint = `${url}/makepayment/${id}`;
  return await axios.post(endpoint);
}
