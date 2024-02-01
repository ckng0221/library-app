import { ICart } from '../interfaces/cart';
import { ICustomer } from '../interfaces/customer';
import { getApi } from './api';

const BASE_URL = import.meta.env.VITE_CUSTOMER_API_BASE_URL;
const resourceCustomer = '/api/customer/customers';
const urlCustomer = `${BASE_URL}${resourceCustomer}`;
const resourceCart = '/api/customer/carts';
const urlCart = `${BASE_URL}${resourceCart}`;
const api = getApi();

export async function getCustomers(
  query: { email?: string; search?: string } = {},
) {
  const endpoint = urlCustomer;
  return await api.get(endpoint, { params: query });
}

export async function getCustomerById(id: string) {
  const endpoint = `${urlCustomer}/${id}`;
  return await api.get(endpoint);
}

export async function createCustomer(payload: Partial<ICustomer>) {
  const endpoint = urlCustomer;
  return await api.post(endpoint, payload);
}

// Cart
export async function getCartsByCustomerId(id: string) {
  const endpoint = `${urlCustomer}/${id}/carts`;
  return await api.get(endpoint);
}

export async function createCart(payload: Partial<ICart>) {
  const endpoint = urlCart;
  return await api.post(endpoint, payload);
}

export async function getCartById(id: string) {
  const endpoint = `${urlCart}/${id}`;
  return await api.get(endpoint);
}

export async function updateCartById(id: string, payload: Partial<ICart>) {
  const endpoint = `${urlCart}/${id}`;
  return await api.patch(endpoint, payload);
}

export async function deleteCartById(id: string) {
  const endpoint = `${urlCart}/${id}`;
  return await api.delete(endpoint);
}
