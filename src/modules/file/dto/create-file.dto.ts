import { IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateFileDto {
  @IsNotEmpty({ message: '文件名称不能为空' })
  @IsString({ message: '文件名称必须是字符串' })
  @Length(1, 50, { message: '文件名称长度必须在 1 到 50 之间' })
  fileName: string;
  @IsNotEmpty({ message: '文件路径不能为空' })
  @IsString({ message: '文件路径必须是字符串' })
  @Length(1, 255, { message: '文件路径长度必须在 1 到 255 之间' })
  filePath: string;
}
