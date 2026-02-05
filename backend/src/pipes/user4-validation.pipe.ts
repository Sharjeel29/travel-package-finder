import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class User4ValidationPipe implements PipeTransform {
  transform(value: any) {
    return value; 
  }
}
