import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '../../../packages/nestlib';
import * as Joi from 'joi';
import { DatabaseModule } from '../../../packages/nestlib';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { EventGateway } from './events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
        BASEURL_AUTH: Joi.string().required(),
      }),
      envFilePath: './apps/payment/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    RmqModule.register({
      name: 'PAYMENT',
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, EventGateway],
})
export class PaymentModule {}
