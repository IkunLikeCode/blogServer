import { IsNotEmpty, Length } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty({ message: '分类名称不能为空' })
  @Length(1, 50, { message: '分类名称长度必须在1-50之间' })
  categoryName: string;
}
