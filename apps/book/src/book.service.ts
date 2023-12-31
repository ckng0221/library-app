import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dto/book.dto';
import { Book } from './schemas/book.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @Inject('NOTIFICATION') private notificationClient: ClientProxy,
  ) {}

  async findAll(query?: { search: string }): Promise<ReadBookDto[]> {
    const searchString = query?.search || '';

    const searchOption = searchString
      ? { $text: { $search: searchString } }
      : null;

    return this.bookModel.find(searchOption);
  }

  async findOne(id: string): Promise<ReadBookDto> {
    return this.bookModel.findById(id);
  }

  async updateOne(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<ReadBookDto> {
    return this.bookModel.findByIdAndUpdate(id, updateBookDto, {
      new: true,
    });
  }

  async create(createBookDto: CreateBookDto): Promise<ReadBookDto> {
    const book = new this.bookModel(createBookDto);
    book.save();

    this.notificationClient.emit('book_added', { book });
    console.log('Emitted book notification event to queue.');

    return book;
  }

  async deleteOne(id: string) {
    return this.bookModel.findByIdAndDelete(id);
  }
}
