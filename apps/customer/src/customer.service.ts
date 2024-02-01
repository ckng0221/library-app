import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateCustomerCartDto,
  CreateCustomerDto,
  CustomerCartDto,
  CustomerCredentialDto,
  ReadCustomerCartDto,
  ReadCustomerDto,
  UpdateCustomerCartDto,
  UpdateCustomerDto,
} from './dto/customer.dto';
import {
  Customer,
  CustomerCart,
  CustomerCredential,
} from './schemas/customer.schema';
import bcrypt from 'bcrypt';
@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findAll(
    query: { email?: string; search?: string } = null,
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
    // console.log(customer);

    // return this.customerCredentialModel.findOne(searchOption);
    return this.customerCredentialModel
      .find({ customer: customer })
      .populate('customer');
  }

  async create(createCredDto: CustomerCredentialDto): Promise<any> {
    const saltRound = 10;
    const hashedPawssword = await bcrypt.hash(
      createCredDto.password,
      saltRound,
    );
    createCredDto.password = hashedPawssword;
    // console.log(hashedPawssword);

    const customer = new this.customerCredentialModel(createCredDto);
    return customer.save();
  }
}

@Injectable()
export class CustomerCartService {
  constructor(
    @InjectModel(CustomerCart.name)
    private customerCartModel: Model<CustomerCart>,
  ) {}

  async findAllbyCustomerId(id: string): Promise<ReadCustomerCartDto[]> {
    return this.customerCartModel.find({
      customer: new Types.ObjectId(id),
    });
  }

  async findOne(id: string): Promise<ReadCustomerCartDto> {
    return this.customerCartModel.findById(id);
  }

  async updateOne(id: string, updateCustomerCartDto: UpdateCustomerCartDto) {
    return this.customerCartModel.findByIdAndUpdate(id, updateCustomerCartDto, {
      new: true,
    });
  }

  async create(createCustomerCartDto: CreateCustomerCartDto) {
    const customerCart = new this.customerCartModel(createCustomerCartDto);
    return customerCart.save();
  }

  async deleteOne(id: string) {
    return this.customerCartModel.findByIdAndDelete(id);
  }

  async deleteMany(ids: string[]) {
    return this.customerCartModel.deleteMany({ _id: { $in: [...ids] } });
  }
}
