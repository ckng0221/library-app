import { IBorrowing } from '../interfaces/borrowing';
import { getApi } from './api';

const BASE_URL = import.meta.env.VITE_BORROWING_API_BASE_URL;
const resource = '/api/borrowing/borrowings';
const url = `${BASE_URL}${resource}`;
const api = getApi();

export async function getBorrowings({ customer_id }: { customer_id: string }) {
  const endpoint = url;
  // console.log('id', customer_id);

  return await api.get(endpoint, {
    params: {
      customer_id,
    },
  });
}

export async function getBorrowingById(id: string) {
  const endpoint = `${url}/${id}`;
  return await api.get(endpoint);
}

export async function createBorrowing(payload: IBorrowing) {
  const endpoint = url;

  return await api.post(endpoint, payload);
}
