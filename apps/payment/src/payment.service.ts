import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto, ReadPaymentDto } from './dto/payment.dto';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

async function makeFakePayment(
  payment_id: string,
  logger: Logger,
): Promise<'success' | 'failed'> {
  logger.log('Redirecting to payment gateway...');
  logger.log('Performing payment...');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logger.log(`Payment complete for payment_id: ${payment_id} .`);
        return resolve('success');
      } catch (error) {
        logger.error(error);
        return reject('failed');
      }
    }, 2000);
  });
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @Inject('PAYMENT') private readonly paymentClient: ClientProxy,
  ) {}

  private readonly logger = new Logger(PaymentService.name);

  async findAll(): Promise<ReadPaymentDto[]> {
    return this.paymentModel.find();
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<ReadPaymentDto> {
    const payment = await new this.paymentModel(createPaymentDto).save();

    return payment;
  }

  async findOne(id: string): Promise<ReadPaymentDto> {
    return this.paymentModel.findById(id);
  }

  async deleteOne(id: string) {
    return this.paymentModel.findByIdAndDelete(id);
  }

  async makePayment(id: string) {
    const payment = await this.paymentModel.findById(id);
    this.logger.log(
      `Making payment for payment_id: ${id}; borrowing_id: ${payment.borrowing_id}...`,
    );
    const paymentStatus = await makeFakePayment(id, this.logger);

    if (paymentStatus === 'success') {
      await this.paymentModel.findByIdAndUpdate(id, {
        is_payment_done: true,
        payment_date: new Date(),
      });

      const data = JSON.stringify({
        payment_id: id,
        borrowing_id: payment.borrowing_id,
        status: paymentStatus,
      });

      this.paymentClient.emit('payment_done', data);
      this.paymentClient.emit('payment_done', data);
      console.log(
        `Emitted payment_done for payment_id ${id}, borrowing_id: ${payment.borrowing_id}`,
      );
    }

    return paymentStatus;
  }
}
