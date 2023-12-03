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
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Payment' });

  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  await app.startAllMicroservices();

  const PORT = process.env.PORT || 8004;
  await app.listen(PORT);
}
bootstrap();
