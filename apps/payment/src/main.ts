import { NestFactory } from '@nestjs/core';
import { RmqService } from '../../../libs/common/src/rabbitmq/rmq.service';
import { PaymentModule } from './payment.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get<RmqService>(RmqService);

  const config = new DocumentBuilder()
    .setTitle('Payment API')
    .setDescription('Payment API')
    .setVersion('1.0')
    .addTag('Payment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  await app.startAllMicroservices();

  await app.listen(3003);
}
bootstrap();
