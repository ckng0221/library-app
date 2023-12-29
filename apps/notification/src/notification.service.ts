import { Injectable, Logger } from '@nestjs/common';

async function sendFakeNotification(bookName: string, logger: Logger) {
  const message = `New book arrival! Book: ${bookName}`;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logger.log(
          `Sent notification of new book arrival to customers! Message: ${message} `,
        );
        return resolve('success');
      } catch (error) {
        logger.error(error);
        return reject('failed');
      }
    }, 1000);
  });
}

@Injectable()
export class NotificationService {
  // constructor(
  //   @Inject('NOTIFICATION') private readonly notificationClient: ClientProxy,
  // ) {}

  private readonly logger = new Logger(NotificationService.name);

  async sendNotification(bookName: string) {
    await sendFakeNotification(bookName, this.logger);
  }
}
