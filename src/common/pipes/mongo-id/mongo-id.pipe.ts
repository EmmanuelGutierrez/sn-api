import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} not is a mongoId`);
    }
    return value;
  }
}
