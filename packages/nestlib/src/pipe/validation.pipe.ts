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
  exceptionFactory?: (error: string) => unknown;
  optional?: boolean;
}

interface ObjectIdLike {
  id: string | Uint8Array;
  __id?: string;
  toHexString(): string;
}
/**
 * Ensure objectId of MongoDB
 */
@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  protected exceptionFactory: (error: string) => unknown;

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

  transform(
    value: string | number | Types.ObjectId | ObjectIdLike | Uint8Array,
  ) {
    if (Types.ObjectId.isValid(value)) return value;
    throw this.exceptionFactory(this.options.errorMessage || 'Invalid ID');
  }
}
