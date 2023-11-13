import { Module } from '@nestjs/common';
import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from './borrowing.service';

@Module({
  imports: [],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
