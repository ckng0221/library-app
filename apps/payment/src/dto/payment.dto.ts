import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class PaymentDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '656215a752ad6138536f74a4',
  })
  borrowing_id: Types.ObjectId;

  @IsNumber()
  @ApiProperty({
    example: 100,
  })
  amount: number;
}

export class CreatePaymentDto extends PaymentDto {}

export class UpdatePaymentDto extends PartialType(PaymentDto) {
  is_payment_done: boolean;
}

export class ReadPaymentDto extends PaymentDto {
  @ApiProperty({ example: '656215a762ad6138536f74a4' })
  _id: Types.ObjectId;

  is_payment_done: boolean;
  created_date: Date;
  payment_date: Date;
}
