import { Controller, Get } from '@nestjs/common';
import { BorrowingService } from './borrowing.service';

@Controller()
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Get()
  getHello(): string {
    return this.borrowingService.getHello();
  }
}
