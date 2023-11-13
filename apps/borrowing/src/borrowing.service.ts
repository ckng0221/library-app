import { Injectable } from '@nestjs/common';

@Injectable()
export class BorrowingService {
  getHello(): string {
    return 'Hello World!';
  }
}
