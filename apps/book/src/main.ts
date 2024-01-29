import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { BookModule } from './book.module';
import cookieParser from 'cookie-parser';

// console.log('DB-URI', process.env.MONGODB_URI);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(BookModule);

  const config = new DocumentBuilder()
    .setTitle('Book API')
    .setDescription('Book API')
    .setVersion('1.0')
    .addTag('Book')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Book' });

  const PORT = process.env.PORT || 8001;
  const loggingMode =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(loggingMode));
  app.use(cookieParser());
  // app.enableCors();
  app.disable('x-powered-by');
  await app.listen(PORT);
}
bootstrap();
