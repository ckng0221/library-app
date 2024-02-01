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
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BorrowingService } from './borrowing.service';
import {
  CreateBorrowingDto,
  ReadBorrowingDto,
  UpdateBorrowingDto,
} from './dto/borrowing.dto';

import { EventPattern, Payload } from '@nestjs/microservices';
import { ObjectIdValidationPipe } from '../../../packages/nestlib';
import { IPaymentDone } from '../../ui/src/interfaces/payment';
import { AuthGuard } from '../../../packages/nestlib/src/auth/auth.guard';

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

  @UseGuards(AuthGuard)
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
    @Body() updateBorrowingDto: UpdateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.updateOne(id, updateBorrowingDto);
  }

  @EventPattern('payment_done')
  async handlePaymentDone(@Payload() data: string) {
    const payment: IPaymentDone = JSON.parse(data);

    return await this.borrowingService.updateOne(payment.borrowing_id, {
      is_payment_done: true,
    });
    // console.log(borrowing);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createBorrowingDto: CreateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.create(createBorrowingDto);
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
    return this.borrowingService.deleteOne(id);
  }
}
