import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer', unique: true })
  customer: Customer;

  @Prop()
  password: string;
}

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'create_at', updatedAt: 'update_at' },
})
export class CustomerCart extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: Customer | Types.ObjectId;

  @Prop({ required: true })
  book_id: Types.ObjectId;

  @Prop({ required: true })
  book_title: string;

  @Prop({ default: 1 })
  quantity: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
export const CustomerCredentialSchema =
  SchemaFactory.createForClass(CustomerCredential);
export const CustomerCartSchema = SchemaFactory.createForClass(CustomerCart);

CustomerSchema.index({ name: 'text', email: 'text' });
