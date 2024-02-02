import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { AuthModule } from './auth.module';

// console.log('DB-URI', process.env.MONGODB_URI);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Auth API')
    .setVersion('1.0')
    .addTag('Auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Auth' });

  const PORT = process.env.PORT || 8005;
  const loggingMode =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(loggingMode));
  // app.enableCors();
  app.disable('x-powered-by');
  await app.listen(PORT);
}
bootstrap();
