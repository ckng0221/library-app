const BASE_URL = import.meta.env.VITE_BOOK_API_BASE_URL;
const resource = '/books';
const url = `${BASE_URL}${resource}`;

export async function getBooks() {
  const endpoint = url;
  const res = await fetch(endpoint);
  const books = await res.json();
  return books;
}

export async function getBookById(id: string) {
  const endpoint = `${url}/${id}`;
  const res = await fetch(endpoint);
  const book = await res.json();
  return book;
}