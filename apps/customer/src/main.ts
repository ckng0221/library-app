import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomerModule } from './customer.module';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(CustomerModule);

  const config = new DocumentBuilder()
    .setTitle('Customer API')
    .setDescription('Customer API')
    .setVersion('1.0')
    .addTag('Customer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Customer' });

  const loggingMode =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.enableCors();
  app.use(helmet());
  app.use(morgan(loggingMode));

  const PORT = process.env.PORT || 8002;
  await app.listen(PORT);
}
bootstrap();
