import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, ReadCustomerDto } from './dto/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(): Promise<ReadCustomerDto[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadCustomerDto> {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateCustomerDto: Partial<CreateCustomerDto>,
  ): Promise<ReadCustomerDto> {
    return this.customerService.updateOne(id, updateCustomerDto);
  }

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ReadCustomerDto> {
    return this.customerService.create(createCustomerDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.customerService.deleteOne(id);
  }
}
