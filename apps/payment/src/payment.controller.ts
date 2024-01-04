import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiQuery } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '../../../packages/nestlib';
import { CreatePaymentDto, ReadPaymentDto } from './dto/payment.dto';
import { EventGateway } from './events.gateway';
import { PaymentService } from './payment.service';
import { ReadBorrowingDto } from '../../borrowing/src/dto/borrowing.dto';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly eventsGateway: EventGateway,
  ) {}

  @Get()
  @ApiQuery({ name: 'borrowing_id', required: false })
  findAll(
    @Query() query?: { search: string; customer_id: string },
  ): Promise<ReadPaymentDto[]> {
    return this.paymentService.findAll(query);
  }

  // NOTE: for internal use only, payment should created from event
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<ReadPaymentDto> {
    return this.paymentService.create(createPaymentDto);
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
  ): Promise<ReadPaymentDto> {
    return this.paymentService.findOne(id);
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
    return this.paymentService.deleteOne(id);
  }

  @HttpCode(200)
  @Post('makepayment/:id')
  async makePayment(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
  ): Promise<{ payment_id: string; status: 'success' | 'failed' }> {
    const obj = await this.paymentService.makePayment(id);
    this.eventsGateway.emitEvent('payment_done', {
      payment_id: obj.payment_id,
      borrowing_id: obj.borrowing_id,
      status: obj.status,
    });
    return { payment_id: id, status: obj.status };
  }

  @EventPattern('borrowing_created')
  async handleBorrowingCreated(
    @Payload() data: { borrowing: ReadBorrowingDto },
  ) {
    // console.log(data);

    console.log(
      `Received borrowing_created. borrowing_id: ${data.borrowing._id}`,
    );

    const payment = await this.paymentService.create({
      borrowing_id: data.borrowing._id,
      amount: getRandomArbitrary(1, 100),
    });

    console.log(`Created payment_id: ${payment._id}`);
  }
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
