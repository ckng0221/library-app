import { NestFactory } from '@nestjs/core';
import { RmqService } from '../../../libs/common/src/rabbitmq/rmq.service';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  await app.startAllMicroservices();
}
bootstrap();
