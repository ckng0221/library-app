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
import { BorrowingService } from './borrowing.service';
import {
  CreateBorrowingDto,
  ReadBorrowingDto,
  UpdateBorrowingDto,
} from './dto/borrowing.dto';
import { ApiQuery } from '@nestjs/swagger';

import { ObjectIdValidationPipe } from '../../../libs/common/src/pipe/validation.pipe';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}
  @Get()
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query?: { search: string }): Promise<ReadBorrowingDto[]> {
    return this.borrowingService.findAll(query);
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
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.findOne(id);
  }

  // @EventPattern('payment_done')
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
    @Body() updateBorrowingDto: UpdateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.updateOne(id, updateBorrowingDto);
  }

  @EventPattern('payment_done')
  async handlePaymentDone(@Payload() data: any, @Ctx() context: RmqContext) {
    // this.borrowingService.updateOne(id, updateBorrowingDto);
    // const paymentStatus = await this.paymentService.makePayment(data);
    // this.rmqService.ack(context);
    // return { data, paymentStatus };
    console.log(data);
    // console.log(context);
  }

  @Post()
  create(
    @Body() createBorrowingDto: CreateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.create(createBorrowingDto);
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
    return this.borrowingService.deleteOne(id);
  }
}
