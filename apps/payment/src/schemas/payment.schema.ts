import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../../../../libs/common/src/database/abstract.schema';

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'payment_date', updatedAt: false },
})
export class Payment extends AbstractDocument {
  @Prop({ type: Types.ObjectId })
  borrowing_id: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  amount: number;

  payment_date: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
