import { ApiProperty, PartialType } from '@nestjs/swagger';
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

export class CreateCustomerDto extends CustomerDto {
  @IsString()
  @ApiProperty({})
  password?: string;
}

export class UpdateCustomerDto extends PartialType(CustomerDto) {}

export class ReadCustomerDto extends CustomerDto {
  @ApiProperty()
  _id: Types.ObjectId;
}

export class CustomerCredentialDto {
  @ApiProperty({ example: '655977ed7b831cef1b597be5' })
  customer: Types.ObjectId;

  @ApiProperty()
  password: string;
}

export class ReadCustomerCredentialDto extends CustomerCredentialDto {
  @ApiProperty()
  _id: Types.ObjectId;
}

export class CustomerCartDto {
  @ApiProperty({ example: '655977ed7b831cef1b597be5' })
  customer: Types.ObjectId;

  @ApiProperty({ example: '655977ed7b831cef1b597be5' })
  book_id: Types.ObjectId;

  @ApiProperty()
  book_title: string;

  @ApiProperty({ default: 1 })
  quantity: number;
}

export class CreateCustomerCartDto extends CustomerCartDto {}

export class UpdateCustomerCartDto extends PartialType(CustomerCartDto) {}

export class ReadCustomerCartDto extends CustomerCartDto {
  @ApiProperty()
  _id: Types.ObjectId;

  create_at?: Date;
  update_at?: Date;
}
