import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class Book extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop()
  author: string;

  @Prop()
  isbn: string;

  @Prop()
  published_date: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index({ title: 'text', author: 'text', isbn: 'text' });
