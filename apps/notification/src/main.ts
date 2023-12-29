import { NestFactory } from '@nestjs/core';
import { RmqService } from '../../../packages/nestlib';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions('NOTIFICATION'));
  await app.startAllMicroservices();

  // const PORT = process.env.PORT || 8004;
  // await app.listen(PORT);
}
bootstrap();
