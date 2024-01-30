import { getApi } from './api';

const BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
const resource = '/api/auth';
const url = `${BASE_URL}${resource}`;

export async function login(payload: { email: string; password: string }) {
  const endpoint = `${url}/auth/login`;
  return await getApi().post(endpoint, payload);
}

export async function tokenVerification(payload: { token: string }) {
  const endpoint = `${url}/auth/verification`;
  return await getApi().post(endpoint, payload);
}
