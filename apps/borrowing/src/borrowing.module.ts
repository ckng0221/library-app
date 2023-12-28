import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BorrowingService } from './borrowing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Borrowing, BorrowingSchema } from './schemas/borrowing.schema';
import { DatabaseModule } from '../../../packages/nestlib';
import { BorrowingController } from './borrowing.controller';
import { RmqModule } from '../../../packages/nestlib';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
      }),
      envFilePath: 'apps/borrowing/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Borrowing.name, schema: BorrowingSchema },
    ]),
    RmqModule.register({
      name: 'PAYMENT',
    }),
  ],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
