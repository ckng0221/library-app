import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('book_added')
  async handleBorrowingCreated(@Payload() data: any) {
    console.log(`Received new book. Name: ${data.book?.title}`);
    return this.notificationService.sendNotification(data.book.title);
  }
}
