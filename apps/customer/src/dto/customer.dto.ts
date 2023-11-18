import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'My Customer',
  })
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    format: 'email',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: '123 street, USA.',
  })
  address: string;
}

export class CreateCustomerDto extends CustomerDto {}

export class ReadCustomerDto extends CustomerDto {
  @ApiProperty()
  _id: Types.ObjectId;
}
