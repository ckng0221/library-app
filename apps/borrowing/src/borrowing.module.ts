import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from './borrowing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Borrowing, BorrowingSchema } from './schemas/borrowing.schema';
import { DatabaseModule } from '../../../libs/common/src/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/borrowing/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Borrowing.name, schema: BorrowingSchema },
    ]),
  ],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
