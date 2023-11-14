import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto, ReadBookDto } from './dto/book.dto';
import { Book } from './schemas/book.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async findAll(): Promise<ReadBookDto[]> {
    return this.bookModel.find();
  }

  async findOne(id: string) {
    return this.bookModel.findById(id);
  }

  async updateOne(id: string, createBookDto: CreateBookDto) {
    return this.bookModel.findByIdAndUpdate(id, createBookDto, {
      new: true,
    });
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = new this.bookModel(createBookDto);
    return book.save();
  }

  async deleteOne(id: string) {
    return this.bookModel.findByIdAndDelete(id);
  }
}
