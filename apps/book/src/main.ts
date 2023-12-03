import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BookModule } from './book.module';

console.log('DB-URI', process.env.MONGODB_URI);

async function bootstrap() {
  const app = await NestFactory.create(BookModule);

  const config = new DocumentBuilder()
    .setTitle('Book API')
    .setDescription('Book API')
    .setVersion('1.0')
    .addTag('Book')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 8001;
  await app.listen(PORT);
}
bootstrap();
