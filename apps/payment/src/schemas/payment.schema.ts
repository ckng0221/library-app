import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../../../../packages/nestlib';

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'created_date', updatedAt: false },
})
export class Payment extends AbstractDocument {
  @Prop({ type: Types.ObjectId })
  borrowing_id: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ default: false })
  is_payment_done: false;

  @Prop()
  payment_date: Date;

  created_date: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
