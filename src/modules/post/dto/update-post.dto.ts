import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString({ message: '文章ID必须是字符串' })
  @IsNotEmpty({ message: '文章ID不能为空' })
  id: string;
  @IsString({ message: '文章标题必须是字符串' })
  @IsNotEmpty({ message: '文章标题不能为空' })
  @Length(1, 50, { message: '文章标题长度必须在1-50之间' })
  title: string;
  @IsString({ message: '文章摘要必须是字符串' })
  @IsNotEmpty({ message: '文章摘要不能为空' })
  @Length(1, 50, { message: '文章摘要长度必须在1-50之间' })
  summary: string;
  @IsString({ message: '文章内容必须是字符串' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string;
  cover?: string;
  status?: number;
  categoryId: string;
  tagIds?: string[];
}
