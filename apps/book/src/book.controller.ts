import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto } from './dto/book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  findAll(): Promise<ReadBookDto[]> {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadBookDto> {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() createBookDto: CreateBookDto,
  ): Promise<ReadBookDto> {
    return this.bookService.updateOne(id, createBookDto);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<ReadBookDto> {
    return this.bookService.create(createBookDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.bookService.deleteOne(id);
  }
}
