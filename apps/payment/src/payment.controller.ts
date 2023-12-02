import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ObjectIdValidationPipe } from '../../../libs/common/src/pipe/validation.pipe';
import { CreatePaymentDto, ReadPaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  borrowingService: any;
  constructor(
    private readonly paymentService: PaymentService,
    // private readonly rmqService: RmqService,
  ) {}

  @Get()
  findAll(): Promise<ReadPaymentDto[]> {
    return this.paymentService.findAll();
  }

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

  @EventPattern('borrowing_created')
  async handleBorrowingCreated(
    @Payload() data: any,
    // @Ctx() context: RmqContext,
  ) {
    const paymentStatus = await this.paymentService.makePayment(data);
    // this.rmqService.ack(context);

    return { data, paymentStatus };
  }
}
