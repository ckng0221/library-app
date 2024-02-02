import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ObjectIdValidationPipe } from '../../../packages/nestlib';
import { AuthGuard } from '../../../packages/nestlib/src/auth/auth.guard';
import {
  CustomerCartService,
  CustomerCredentialService,
  CustomerService,
} from './customer.service';
import {
  CreateCustomerCartDto,
  CreateCustomerDto,
  CustomerCredentialDto,
  ReadCustomerCartDto,
  ReadCustomerCredentialDto,
  ReadCustomerDto,
  UpdateCustomerCartDto,
  UpdateCustomerDto,
} from './dto/customer.dto';

@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerCredService: CustomerCredentialService,
    private readonly customerCartService: CustomerCartService,
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

  // Cart for particular customer only
  @Get(':id/carts')
  findOneCarts(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
  ): Promise<ReadCustomerCartDto[]> {
    return this.customerCartService.findAllbyCustomerId(id);
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

@ApiBearerAuth()
@ApiTags('Cart')
@Controller('carts')
export class CustomerCartController {
  constructor(private readonly customerCartService: CustomerCartService) {}

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
  ): Promise<ReadCustomerCartDto> {
    return this.customerCartService.findOne(id);
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
    @Body() updateCustomerCartDto: UpdateCustomerCartDto,
  ) {
    return this.customerCartService.updateOne(id, updateCustomerCartDto);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCustomerCartDto: CreateCustomerCartDto,
    @Req() request?: Request,
  ) {
    const req: any = request;

    console.log(req.user);
    console.log(createCustomerCartDto.customer);

    if (createCustomerCartDto.customer !== req?.user?.sub)
      throw new UnauthorizedException('customer_id does not match');

    return this.customerCartService.create(createCustomerCartDto);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteOne(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
    @Req() request?: Request,
  ) {
    const req: any = request;

    const cart = await this.customerCartService.findOne(id);

    // console.log(req?.user?.sub);
    // console.log(cart.customer.toString());

    if (cart.customer.toString() !== req?.user?.sub)
      throw new UnauthorizedException('customer_id does not match');

    this.customerCartService.deleteOne(id);

    return;
  }

  //   @UseGuards(AuthGuard)
  //   @Delete('')
  //   async deleteMany(
  //     @Param(
  //       'id',
  //       new ObjectIdValidationPipe({
  //         errorHttpStatusCode: HttpStatus.NOT_FOUND,
  //         errorMessage: 'ID not found',
  //       }),
  //     )
  //     ids: string[],
  //     @Req() request?: Request,
  //   ) {
  //     const req: any = request;

  //     const cartsPromise = ids.map((id) => {
  //       return this.customerCartService.findOne(id);
  //     });
  //     const carts = await Promise.all(cartsPromise);

  //     carts.map((cart) => {
  //       if (cart.customer.toString() !== req?.user?.sub)
  //         throw new UnauthorizedException('customer_id does not match');
  //     });

  //     return this.customerCartService.deleteMany(ids);
  //   }
}
