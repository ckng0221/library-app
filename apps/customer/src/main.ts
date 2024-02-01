import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { CustomerModule } from './customer.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(CustomerModule);

  const config = new DocumentBuilder()
    .setTitle('Customer API')
    .setDescription('Customer API')
    .setVersion('1.0')
    .addTag('Customer')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Customer' });

  const loggingMode =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  // app.enableCors();
  app.use(morgan(loggingMode));
  app.disable('x-powered-by');

  const PORT = process.env.PORT || 8002;
  await app.listen(PORT);
}
bootstrap();
