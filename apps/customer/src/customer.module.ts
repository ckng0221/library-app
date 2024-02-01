import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../../../packages/nestlib';
import {
  CustomerController,
  CustomerCredentialController,
} from './customer.controller';
import { CustomerCredentialService, CustomerService } from './customer.service';
import {
  Customer,
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
    ]),
  ],
  controllers: [CustomerController, CustomerCredentialController],
  providers: [CustomerService, CustomerCredentialService],
})
export class CustomerModule {}
