import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../packages/nestlib';
import { Types } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'borrowed_date', updatedAt: false },
})
export class Borrowing extends AbstractDocument {
  @Prop({ required: true })
  customer_id: Types.ObjectId;

  @Prop({ required: true })
  customer_name: string;

  @Prop({ required: true })
  books: [
    {
      id: Types.ObjectId;
      name: string;
      quantity: number;
      returned_date?: Date | null;
    },
  ];

  @Prop()
  is_active: boolean;

  @Prop()
  borrowed_date: Date;

  @Prop({ default: false })
  is_payment_done: boolean;

  @Prop()
  closed_date: Date | null;
}

export const BorrowingSchema = SchemaFactory.createForClass(Borrowing);
BorrowingSchema.index({ customer_name: 'text' });
