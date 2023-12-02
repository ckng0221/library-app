import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto, ReadPaymentDto } from './dto/payment.dto';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

async function makeFakePayment(
  data: any,
  logger: Logger,
): Promise<'success' | 'failed'> {
  logger.log('Redirecting to payment gateway...');
  logger.log('Performing payment...');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logger.log(
          `Payment complete for borrowing_id: ${data.borrowing._id} .`,
        );
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

    // console.log(`Emitted payment for borrowing_id: ${payment._id}`);
    // this.paymentClient.emit('borrowing_created', {
    //   borrowing: payment,
    // });
    return payment;
  }

  async findOne(id: string): Promise<ReadPaymentDto> {
    return this.paymentModel.findById(id);
  }

  async deleteOne(id: string) {
    return this.paymentModel.findByIdAndDelete(id);
  }

  async makePayment(data: any) {
    this.logger.log(
      `Making payment for borrowing_id: ${data.borrowing._id}...`,
    );
    const paymentStatus = await makeFakePayment(data, this.logger);

    if (paymentStatus === 'success') {
      this.paymentClient.emit(
        'payment_done',

        JSON.stringify({
          borrowing_id: data.borrowing._id,
          status: paymentStatus,
        }),
      );
      console.log(
        `Emitted payment_done for borrowing_id: ${data.borrowing._id}`,
      );
    }

    return paymentStatus;
  }
}
