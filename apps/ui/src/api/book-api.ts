import { IBook } from '../interfaces/book';
import { getApi } from './api';

const BASE_URL = import.meta.env.VITE_BOOK_API_BASE_URL;
const resource = '/api/book/books';
const url = `${BASE_URL}${resource}`;
const api = getApi();

export async function getBooks() {
  const endpoint = url;
  return await api.get(endpoint);
}

export async function getBookById(id: string) {
  const endpoint = `${url}/${id}`;

  return await api.get(endpoint);
}

export async function createBook(payload: Partial<IBook>) {
  const endpoint = url;
  return await api.post(endpoint, payload);
}
