import axios from 'axios';

const BASE_URL = import.meta.env.VITE_CUSTOMER_API_BASE_URL;
const resource = '/customers';
const url = `${BASE_URL}${resource}`;

export async function getCustomers() {
  const endpoint = url;
  return await axios.get(endpoint);
}

export async function getCustomerById(id: string) {
  const endpoint = `${url}/${id}`;
  return await axios.get(endpoint);
}
