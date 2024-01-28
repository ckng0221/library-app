import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractDocument } from '../../../../packages/nestlib';

@Schema({ versionKey: false })
export class Customer extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  address: string;
}

@Schema({ versionKey: false })
export class CustomerCredential extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop()
  password: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
export const CustomerCredentialSchema =
  SchemaFactory.createForClass(CustomerCredential);
CustomerSchema.index({ name: 'text', email: 'text' });
