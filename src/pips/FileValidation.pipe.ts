import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private size = 4 * 1024 * 1024;
  // 只支持文件格式
  private imgType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  transform(value: any, _metadata: ArgumentMetadata) {
    if (!value) {
      throw new HttpException('文件不能为空', HttpStatus.BAD_REQUEST);
    }
    if (value.size > this.size) {
      throw new HttpException('文件大小不能超过4mb', HttpStatus.BAD_REQUEST);
    }
    if (!this.imgType.includes(value.mimetype)) {
      throw new HttpException('文件格式错误', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
