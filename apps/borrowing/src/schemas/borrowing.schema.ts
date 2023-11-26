import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src/database/abstract.schema';
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
  books: [{ id: Types.ObjectId; name: string; returned_date?: Date | null }];

  @Prop()
  is_active: boolean;

  @Prop()
  borrowed_date: Date;

  @Prop()
  closed_date: Date | null;
}

export const BorrowingSchema = SchemaFactory.createForClass(Borrowing);
BorrowingSchema.index({ customer_name: 'text' });
