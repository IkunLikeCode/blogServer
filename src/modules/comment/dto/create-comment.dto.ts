import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty({ message: '评论者的昵称不能为空' })
  @IsString({ message: '评论者的昵称必须是字符串' })
  @Length(2, 50, { message: '评论者的昵称长度必须在2到50之间' })
  nickname: string;

  @IsNotEmpty({ message: '评论者的邮箱不能为空' })
  @IsEmail({}, { message: '评论者的邮箱格式错误' })
  @Length(1, 100, { message: '评论者的邮箱长度必须在1到100之间' })
  email: string;

  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString({ message: '评论内容必须是字符串' })
  content: string;

  @IsNotEmpty({ message: '评论者的文章ID不能为空' })
  @IsString({ message: '评论者的文章ID必须是字符串' })
  postId: string;
}
