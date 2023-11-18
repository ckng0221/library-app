import { Types } from 'mongoose';
import { Book } from '../schemas/book.schema';

export const BookDtoStub = (title: string = 'Test title'): Book => {
  return {
    _id: new Types.ObjectId(),
    title: title,
    author: 'CK Ng',
    isbn: '978-3-16-148410-0',
    published_date: '2023-01-01',
  };
};
