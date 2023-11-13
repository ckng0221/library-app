import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from './borrowing.service';

describe('BorrowingController', () => {
  let borrowingController: BorrowingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingController],
      providers: [BorrowingService],
    }).compile();

    borrowingController = app.get<BorrowingController>(BorrowingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(borrowingController.getHello()).toBe('Hello World!');
    });
  });
});
