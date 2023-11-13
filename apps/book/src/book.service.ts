import { Injectable } from '@nestjs/common';

@Injectable()
export class BookService {
  findAll(): string {
    return 'Hello World!';
  }
  findOne(id: string): string {
    return id;
  }
  updateOne(id: string): string {
    return id;
  }
  create(obj): string {
    return obj;
  }
  deleteOne(id: string): string {
    return id;
  }
}
