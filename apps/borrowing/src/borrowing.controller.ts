import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import {
  CreateBorrowingDto,
  ReadBorrowingDto,
  UpdateBorrowingDto,
} from './dto/borrowing.dto';
import { ObjectIdValidationPipe } from '../../../libs/common/src/pipe/validation.pipe';

@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

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
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.findOne(id);
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
    @Body() updateBorrowingDto: UpdateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.updateOne(id, updateBorrowingDto);
  }

  @Post()
  create(
    @Body() createBorrowingDto: CreateBorrowingDto,
  ): Promise<ReadBorrowingDto> {
    return this.borrowingService.create(createBorrowingDto);
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
    return this.borrowingService.deleteOne(id);
  }
}
