import { ICustomer } from '../interfaces/customer';
import { getApi } from './api';

const BASE_URL = import.meta.env.VITE_CUSTOMER_API_BASE_URL;
const resource = '/api/customer/customers';
const url = `${BASE_URL}${resource}`;
const api = getApi();

export async function getCustomers(
  query: { email?: string; search?: string } = {},
) {
  const endpoint = url;
  return await api.get(endpoint, { params: query });
}

export async function getCustomerById(id: string) {
  const endpoint = `${url}/${id}`;
  return await api.get(endpoint);
}

export async function createCustomer(payload: Partial<ICustomer>) {
  const endpoint = url;
  return await api.post(endpoint, payload);
}
