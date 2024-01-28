import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'email', required: false })
  findAll(
    @Query() query?: { email: string; search: string },
  ): Promise<ReadCustomerDto[]> {
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
  create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ReadCustomerDto> {
    return this.customerService.create(createCustomerDto);
  }

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
