import { Injectable, Logger } from '@nestjs/common';

async function makeFakePayment(data: any, logger: Logger): Promise<string> {
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
  private readonly logger = new Logger(PaymentService.name);

  async makePayment(data: any) {
    this.logger.log(
      `Making payment for borrowing_id: ${data.borrowing._id}...`,
    );
    return makeFakePayment(data, this.logger);
  }
}
