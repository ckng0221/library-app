import { IBorrowing } from '../interfaces/borrowing';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BORROWING_API_BASE_URL;
const resource = '/borrowings';
const url = `${BASE_URL}${resource}`;

export async function getBorrowings({ customer_id }: { customer_id: string }) {
  const endpoint = url;
  console.log('id', customer_id);

  return await axios.get(endpoint, {
    params: {
      customer_id,
    },
  });
}

export async function getBorrowingById(id: string) {
  const endpoint = `${url}/${id}`;
  return await axios.get(endpoint);
}

export async function createBorrowing(payload: IBorrowing) {
  const endpoint = url;

  return await axios.post(endpoint, payload);
}
