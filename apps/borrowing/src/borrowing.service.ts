import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateBorrowingDto,
  ReadBorrowingDto,
  UpdateBorrowingDto,
} from './dto/borrowing.dto';
import { Borrowing } from './schemas/borrowing.schema';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectModel(Borrowing.name) private borrowingModel: Model<Borrowing>,
    @Inject('PAYMENT') private paymentClient: ClientProxy,
  ) {}

  async findAll(query = null): Promise<ReadBorrowingDto[]> {
    const searchString = query?.search || '';

    const searchOption = searchString
      ? { $text: { $search: searchString } }
      : null;

    return this.borrowingModel.find(searchOption);
  }

  async findOne(id: string): Promise<ReadBorrowingDto> {
    return this.borrowingModel.findById(id);
  }

  async updateOne(
    id: string,
    updateBorrowingDto: UpdateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    console.log(id);
    console.log(updateBorrowingDto);

    return this.borrowingModel.findByIdAndUpdate(id, updateBorrowingDto, {
      new: true,
    });
  }

  async create(
    createBorrowingDto: CreateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    const borrowing = await new this.borrowingModel(createBorrowingDto).save();

    console.log(`Emitted payment for borrowing_id: ${borrowing._id}`);
    this.paymentClient.emit('borrowing_created', {
      borrowing,
    });
    this.paymentClient.emit('borrowing_created', {
      borrowing,
    });
    return borrowing;
  }

  async deleteOne(id: string) {
    return this.borrowingModel.findByIdAndDelete(id);
  }
}
