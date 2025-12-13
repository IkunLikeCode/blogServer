import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { IsNotEmpty } from 'class-validator';
import { Length } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsNotEmpty({ message: '标签名称不能为空' })
  @Length(1, 50, { message: '标签名称长度必须在1-50之间' })
  tagName: string;

  @IsNotEmpty({ message: '标签ID不能为空' })
  @Length(1, 50, { message: '标签ID长度必须在1-50之间' })
  id: string;
}
