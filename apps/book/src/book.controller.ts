import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dto/book.dto';
import { ApiQuery } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '../../../packages/nestlib';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query() query?: { search: string },
    @Headers() headers?: any,
  ): Promise<ReadBookDto[]> {
    // console.log(headers.authorization);
    return this.bookService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
  ): Promise<ReadBookDto> {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<ReadBookDto> {
    return this.bookService.updateOne(id, updateBookDto);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<ReadBookDto> {
    return this.bookService.create(createBookDto);
  }

  @Delete(':id')
  deleteOne(
    @Param(
      'id',
      new ObjectIdValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        errorMessage: 'ID not found',
      }),
    )
    id: string,
  ) {
    return this.bookService.deleteOne(id);
  }
}
