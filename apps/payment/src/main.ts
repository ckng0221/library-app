import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { RmqService } from '../../../packages/nestlib';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get<RmqService>(RmqService);

  const loggingMode =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(helmet());
  app.use(morgan(loggingMode));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Payment API')
    .setDescription('Payment API')
    .setVersion('1.0')
    .addTag('Payment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Payment' });

  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  await app.startAllMicroservices();

  const PORT = process.env.PORT || 8004;
  await app.listen(PORT);
}
bootstrap();
