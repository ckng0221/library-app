import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../../../packages/nestlib';
import {
  CustomerCartController,
  CustomerController,
  CustomerCredentialController,
} from './customer.controller';
import {
  CustomerCartService,
  CustomerCredentialService,
  CustomerService,
} from './customer.service';
import {
  Customer,
  CustomerCart,
  CustomerCartSchema,
  CustomerCredential,
  CustomerCredentialSchema,
  CustomerSchema,
} from './schemas/customer.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/customer/.env' }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerCredential.name, schema: CustomerCredentialSchema },
      { name: CustomerCart.name, schema: CustomerCartSchema },
    ]),
  ],
  controllers: [
    CustomerController,
    CustomerCredentialController,
    CustomerCartController,
  ],
  providers: [CustomerService, CustomerCredentialService, CustomerCartService],
})
export class CustomerModule {}
