const BASE_URL = 'http://localhost:8002';
const resource = '/customers';
const url = `${BASE_URL}${resource}`;

export async function getCustomers() {
  const endpoint = url;
  const res = await fetch(endpoint);
  const customers = await res.json();
  return customers;
}

export async function getCustomerById(id: string) {
  const endpoint = `${url}/${id}`;
  const res = await fetch(endpoint);
  const customer = await res.json();
  return customer;
}
