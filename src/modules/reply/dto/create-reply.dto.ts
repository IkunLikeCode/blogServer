import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEmail,
  Length,
} from 'class-validator';
export class CreateReplyDto {
  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString({ message: '评论内容必须是字符串' })
  content: string;

  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString({ message: '昵称必须是字符串' })
  @Length(2, 50, { message: '昵称长度必须在2到50之间' })
  nickname: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式错误' })
  @Length(1, 100, { message: '邮箱长度必须在1到100之间' })
  email: string;

  @IsNotEmpty({ message: '评论ID不能为空' })
  @IsString({ message: '评论ID必须是字符串' })
  commentId: string;
}
