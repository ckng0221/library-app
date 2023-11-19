import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  ReadCustomerDto,
  UpdateCustomerDto,
} from './dto/customer.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query?: { search: string }): Promise<ReadCustomerDto[]> {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadCustomerDto> {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
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
