import {
  HttpStatus,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from '@nestjs/common/utils/http-error-by-code.util';
import { Types } from 'mongoose';

export interface ObjectIdPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  errorMessage?: string;
  exceptionFactory?: (error: string) => any;
  optional?: boolean;
}
/**
 * Ensure objectId of MongoDB
 */
@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() protected readonly options?: ObjectIdPipeOptions) {
    options = options || {};
    const {
      exceptionFactory,
      errorHttpStatusCode = HttpStatus.NOT_ACCEPTABLE,
    } = options;

    this.exceptionFactory =
      exceptionFactory ||
      ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  transform(value: any) {
    if (Types.ObjectId.isValid(value)) return value;
    throw this.exceptionFactory(this.options.errorMessage || 'Invalid ID');
  }
}
