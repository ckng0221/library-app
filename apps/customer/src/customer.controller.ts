import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CustomerCredentialService, CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  CustomerCredentialDto,
  ReadCustomerCredentialDto,
  ReadCustomerDto,
  UpdateCustomerDto,
} from './dto/customer.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '../../../packages/nestlib';
import { AuthGuard } from '../../../packages/nestlib/src/auth/auth.guard';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerCredService: CustomerCredentialService,
  ) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'email', required: false })
  findAll(
    @Query() query?: { email?: string; search?: string },
    // @Headers() headers?: any,
  ): Promise<ReadCustomerDto[]> {
    // console.log(headers);

    return this.customerService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
  ): Promise<ReadCustomerDto> {
    return this.customerService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateOne(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<ReadCustomerDto> {
    return this.customerService.updateOne(id, updateCustomerDto);
  }

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Headers() headers?: any,
  ): Promise<ReadCustomerDto> {
    // check Email
    const customerCheck = await this.customerService.findAll({
      email: createCustomerDto.email,
    });

    if (customerCheck.length > 0) {
      throw new UnprocessableEntityException('Email already in use.');
    }
    const customer = await this.customerService.create(createCustomerDto);

    // console.log(customer._id);

    if (customer && createCustomerDto.password) {
      await this.customerCredService.create({
        customer: customer?._id,
        password: createCustomerDto.password,
      });
    }
    return customer;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteOne(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
  ) {
    return this.customerService.deleteOne(id);
  }
}

@ApiTags('Credential')
@Controller('customer-credentials')
export class CustomerCredentialController {
  constructor(
    private readonly customerCredService: CustomerCredentialService,
  ) {}

  @Get('')
  @ApiQuery({ name: 'email', required: true })
  findCred(@Query() query?: { email: string }) {
    return this.customerCredService.findCredential(query);
  }

  @Post()
  create(
    @Body() createCredDto: CustomerCredentialDto,
  ): Promise<ReadCustomerCredentialDto> {
    return this.customerCredService.create(createCredDto);
  }
}
