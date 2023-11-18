import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto, ReadCustomerDto } from './dto/customer.dto';
import { Customer } from './schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findAll(): Promise<ReadCustomerDto[]> {
    return this.customerModel.find();
  }

  async findOne(id: string): Promise<ReadCustomerDto> {
    return this.customerModel.findById(id);
  }

  async updateOne(
    id: string,
    updateCustomerDto: Partial<CreateCustomerDto>,
  ): Promise<ReadCustomerDto> {
    return this.customerModel.findByIdAndUpdate(id, updateCustomerDto, {
      new: true,
    });
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<ReadCustomerDto> {
    const customer = new this.customerModel(createCustomerDto);
    return customer.save();
  }

  async deleteOne(id: string) {
    return this.customerModel.findByIdAndDelete(id);
  }
}
