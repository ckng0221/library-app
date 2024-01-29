import axios from './api';

import { IBook } from '../interfaces/book';

const BASE_URL = import.meta.env.VITE_BOOK_API_BASE_URL;
const resource = '/api/book/books';
const url = `${BASE_URL}${resource}`;

export async function getBooks() {
  const endpoint = url;
  return await axios.get(endpoint);
}

export async function getBookById(id: string) {
  const endpoint = `${url}/${id}`;

  return await axios.get(endpoint);
}

export async function createBook(payload: Partial<IBook>) {
  const endpoint = url;
  return await axios.post(endpoint, payload);
}
