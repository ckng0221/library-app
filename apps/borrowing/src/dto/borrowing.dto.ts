import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class BorrowingDto {
  @IsNotEmpty()
  @ApiProperty({ example: "'655976c5554224af8519a724'" })
  customer_id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'My Customer' })
  customer_name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: [
      { id: '6559783dc650b9e8939a0214', name: 'My Book', return_date: null },
    ],
  })
  books: [{ id: Types.ObjectId; name: string; returned_date?: Date | null }];
}

export class CreateBorrowingDto extends BorrowingDto {}

export class UpdateBorrowingDto extends PartialType(BorrowingDto) {
  borrowed_date?: Date;
  closed_date?: Date;
}

export class ReadBorrowingDto extends BorrowingDto {
  @ApiProperty()
  _id: Types.ObjectId;

  is_active: boolean;
}
