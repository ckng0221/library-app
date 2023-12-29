import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { RmqService } from '../../../packages/nestlib';
import { BorrowingModule } from './borrowing.module';

async function bootstrap() {
  const app = await NestFactory.create(BorrowingModule);
  const rmqService = app.get<RmqService>(RmqService);

  const config = new DocumentBuilder()
    .setTitle('Borrowing API')
    .setDescription('Borrowing API')
    .setVersion('1.0')
    .addTag('Borrowing')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Borrowing' });

  app.enableCors();
  const loggingMode =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(helmet());
  app.use(morgan(loggingMode));

  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  await app.startAllMicroservices();

  const PORT = process.env.PORT || 8003;
  await app.listen(PORT);
}
bootstrap();
