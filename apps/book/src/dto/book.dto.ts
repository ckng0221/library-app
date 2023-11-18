import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class BookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'My Book',
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'MyAuthor',
  })
  author: string;

  @IsString()
  @ApiProperty({
    example: '978-3-16-148410-0',
  })
  isbn: string;

  @ApiProperty({
    format: 'date',
  })
  published_date: string;
}

export class CreateBookDto extends BookDto {}

export class UpdateBookDto extends PartialType(BookDto) {}

export class ReadBookDto extends BookDto {
  @ApiProperty()
  _id: Types.ObjectId;
}
