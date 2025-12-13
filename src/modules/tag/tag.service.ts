import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}
  // 创建标签
  async create(createTagDto: CreateTagDto) {
    try {
      if (!createTagDto.tagName) {
        throw new Error('标签名称不能为空');
      }
      const tagExist = await this.findOne(createTagDto);
      if (tagExist) {
        throw new Error('标签已存在');
      }
      const tag = this.tagRepo.create(createTagDto);
      const result = await this.tagRepo.save(tag);
      return {
        message: '创建成功',
        ...result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 删除标签
  async remove(id: string) {
    try {
      const tagExist = await this.tagRepo.findOne({
        where: {
          id,
        },
      });
      if (!tagExist) {
        throw new Error('标签不存在');
      }
      await this.tagRepo.delete(id);
      return {
        message: '删除成功',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 查询所有标签
  async findAll() {
    try {
      const tags = await this.tagRepo.find();
      return {
        message: '查询成功',
        tags,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 更新标签
  async update(updateTagDto: UpdateTagDto) {
    try {
      const tagExist = await this.tagRepo.findOne({
        where: {
          id: updateTagDto.id,
        },
      });
      if (!tagExist) {
        throw new Error('标签不存在');
      }
      await this.tagRepo.update(updateTagDto.id, updateTagDto);
      return {
        message: '更新成功',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 查询改标签是否存在 如果存在就不让创建
  async findOne(createTagDto: CreateTagDto) {
    const tag = await this.tagRepo.findOne({
      where: {
        tagName: createTagDto.tagName,
      },
    });
    if (tag) {
      return true;
    }
    return false;
  }
}
