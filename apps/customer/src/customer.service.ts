import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCustomerDto,
  CustomerCredentialDto,
  ReadCustomerCredentialDto,
  ReadCustomerDto,
  UpdateCustomerDto,
} from './dto/customer.dto';
import { Customer, CustomerCredential } from './schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findAll(
    query: { email: string; search: string } = null,
  ): Promise<ReadCustomerDto[]> {
    const searchString = query?.search || '';
    const searchEmail = query?.email || '';

    let searchOption = {};

    if (searchString) {
      searchOption = { ...searchOption, $text: { $search: searchString } };
    }
    if (searchEmail) {
      searchOption = { ...searchOption, email: searchEmail };
    }

    return this.customerModel.find(searchOption);
  }

  async findOne(id: string): Promise<ReadCustomerDto> {
    return this.customerModel.findById(id);
  }

  async updateOne(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
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
@Injectable()
export class CustomerCredentialService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(CustomerCredential.name)
    private customerCredentialModel: Model<CustomerCredential>,
  ) {}

  async findCredential(query: { email: string }) {
    const searchEmail = query.email || '';

    let searchOption = {};
    if (searchEmail) {
      searchOption = { ...searchOption, email: searchEmail };
    }
    const customer = await this.customerModel.findOne(searchOption);

    // return this.customerCredentialModel.findOne(searchOption);
    return this.customerCredentialModel
      .find({ customer: customer })
      .populate('customer');
  }

  async create(createCredDto: CustomerCredentialDto): Promise<any> {
    const customer = new this.customerCredentialModel(createCredDto);
    return customer.save();
  }
}
