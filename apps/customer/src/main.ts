import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomerModule } from './customer.module';

async function bootstrap() {
  const app = await NestFactory.create(CustomerModule);

  const config = new DocumentBuilder()
    .setTitle('Customer API')
    .setDescription('Customer API')
    .setVersion('1.0')
    .addTag('Customer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 8002;
  await app.listen(PORT);
}
bootstrap();
