import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '../../../libs/common/src/rabbitmq/rmq.service';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('borrowing_created')
  async handleBorrowingCreated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const paymentStatus = await this.paymentService.makePayment(data);
    this.rmqService.ack(context);

    return { data, paymentStatus };
  }
}
