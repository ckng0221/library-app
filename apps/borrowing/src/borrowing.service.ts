import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateBorrowingDto,
  ReadBorrowingDto,
  UpdateBorrowingDto,
} from './dto/borrowing.dto';
import { Borrowing } from './schemas/borrowing.schema';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectModel(Borrowing.name) private borrowingModel: Model<Borrowing>,
  ) {}

  async findOne(id: string): Promise<ReadBorrowingDto> {
    return this.borrowingModel.findById(id);
  }

  async updateOne(
    id: string,
    updateBorrowingDto: UpdateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    return this.borrowingModel.findByIdAndUpdate(id, updateBorrowingDto, {
      new: true,
    });
  }

  async create(
    createBorrowingDto: CreateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    const borrowing = new this.borrowingModel(createBorrowingDto);
    return borrowing.save();
  }

  async deleteOne(id: string) {
    return this.borrowingModel.findByIdAndDelete(id);
  }
}
