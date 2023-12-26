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
import { ApiQuery } from '@nestjs/swagger';
import { BorrowingService } from './borrowing.service';
import {
  CreateBorrowingDto,
  ReadBorrowingDto,
  UpdateBorrowingDto,
} from './dto/borrowing.dto';

import { EventPattern, Payload } from '@nestjs/microservices';
import { ObjectIdValidationPipe } from '../../../libs/common/src/pipe/validation.pipe';

@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}
  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'customer_id', required: false })
  findAll(
    @Query() query?: { search: string; customer_id: string },
  ): Promise<ReadBorrowingDto[]> {
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
  async handlePaymentDone(@Payload() data: any) {
    const payment = JSON.parse(data);

    const borrowing = await this.borrowingService.updateOne(
      payment.borrowing_id,
      {
        is_payment_done: true,
      },
    );
    console.log(borrowing);
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
