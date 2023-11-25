import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BorrowingModule } from './borrowing.module';

async function bootstrap() {
  const app = await NestFactory.create(BorrowingModule);

  const config = new DocumentBuilder()
    .setTitle('Borrowing API')
    .setDescription('Borrowing API')
    .setVersion('1.0')
    .addTag('Borrowing')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3002);
}
bootstrap();
