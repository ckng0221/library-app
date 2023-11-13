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

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  findAll(): string {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string): string {
    return this.bookService.updateOne(id);
  }

  @Post()
  create(@Body() obj): string {
    return this.bookService.create(obj);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): string {
    return this.bookService.deleteOne(id);
  }
}
