import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // 更新分类
  async update(updateCategoryDto: UpdateCategoryDto) {
    try {
      const isExist = await this.findCategoryByName(
        updateCategoryDto.categoryName!,
      );
      console.log(isExist);
      if (!isExist) {
        throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
      }
      // 更新分类
      await this.categoryRepository.update(
        {
          id: updateCategoryDto.id,
        },
        {
          categoryName: updateCategoryDto.categoryName,
        },
      );
      return {
        message: '更新成功',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 创建一个新分类
  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.findCategoryByName(
        createCategoryDto.categoryName,
      );
      // 分类不存在
      if (category) {
        const newCategory = this.categoryRepository.create({
          categoryName: createCategoryDto.categoryName,
        });
        await this.categoryRepository.save(newCategory);
        return {
          ...newCategory,
          message: '创建成功',
        };
      }
      // 分类已存在
      throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 获取所有分类
  async findAll() {
    try {
      return await this.categoryRepository.find({
        order: {
          createAt: 'DESC',
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 删除分类
  async remove(id: string) {
    try {
      const isExist = await this.categoryRepository.findOne({
        where: {
          id,
        },
      });
      if (isExist) {
        await this.categoryRepository.delete(id);
        return {
          message: '删除成功',
        };
      }
      throw new HttpException('分类不存在', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 查找当前分类是否存在
  async findCategoryByName(categoryName: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        categoryName,
      },
    });
    if (category) {
      return false;
    }
    // 分类不存在
    return true;
  }
}
