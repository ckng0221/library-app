import { NestFactory } from '@nestjs/core';
import { BorrowingModule } from './borrowing.module';

async function bootstrap() {
  const app = await NestFactory.create(BorrowingModule);
  await app.listen(3000);
}
bootstrap();
