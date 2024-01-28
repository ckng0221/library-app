import { Types } from 'mongoose';
import { Book } from '../schemas/book.schema';

export const BookDtoStub = (bookObj?: Partial<Book>): Book => {
  return {
    _id: new Types.ObjectId(),
    title: bookObj?.title || 'Test Title',
    author: bookObj?.author || 'Test Author',
    isbn: bookObj?.isbn || '000-0-00-000000-0',
    published_date: bookObj?.published_date || '2023-01-01',
  };
};
