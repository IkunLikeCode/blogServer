import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty({ message: '分类ID不能为空' })
  @IsString({ message: '分类ID必须是字符串' })
  id: string;

  @IsNotEmpty({ message: '分类名称不能为空' })
  categoryName: string;
}
