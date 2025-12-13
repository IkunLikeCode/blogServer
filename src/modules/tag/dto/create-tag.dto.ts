import { IsNotEmpty, Length } from 'class-validator';
export class CreateTagDto {
  @IsNotEmpty({ message: '标签名称不能为空' })
  @Length(1, 50, { message: '标签名称长度必须在1-50之间' })
  tagName: string;
}
