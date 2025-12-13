import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  // 创建文章
  async create(createPostDto: CreatePostDto) {
    try {
      const { title, summary, content, cover, status, categoryId, tagIds } =
        createPostDto;

      const category = await this.categoryRepo.findOne({
        where: { id: categoryId },
      });
      if (!category) throw new NotFoundException('分类不存在');

      const post = this.postRepo.create({
        title,
        summary,
        content,
        cover: cover ?? '',
        status: status ?? 0,
        category,
      });
      const saved = await this.postRepo.save(post);
      if (tagIds && tagIds.length) {
        const uniqueIds = Array.from(new Set(tagIds));
        const withTags = await this.postRepo.findOne({
          where: { id: saved.id },
          relations: ['tags'],
        });
        const existing = new Set(withTags?.tags.map((t) => t.id) ?? []);
        const toAdd = uniqueIds.filter((id) => !existing.has(id));
        if (toAdd.length) {
          await this.postRepo
            .createQueryBuilder()
            .relation(Post, 'tags')
            .of(saved.id)
            .add(toAdd);
        }
      }
      return saved;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 查询文章
  async findOne(id: string) {
    try {
      const { isExist } = await this.checkPostExist(id);
      if (isExist) {
        const res = await this.postRepo.findOne({
          where: { id },
          relations: ['category', 'tags'],
        });
        return {
          message: '查询成功',
          ...res,
        };
      }
      return {
        message: '文章不存在',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 获取所有文章
  async findAll(page: number, pageSize: number) {
    try {
      const p = Number(page) || 1;
      const ps = Number(pageSize) || 10;
      const qb = this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoin('post_tag', 'pt', 'pt.post_id = post.id')
        .leftJoinAndMapMany('post.tags', Tag, 'tags', 'tags.id = pt.tag_id')
        .orderBy('post.createAt', 'DESC')
        .skip((p - 1) * ps)
        .take(ps)
        .distinct(true);
      const [posts, total] = await qb.getManyAndCount();
      return {
        message: '查询成功',
        posts,
        total,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 查询分类下的文章
  async findByCategory(id: string) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id },
      });
      if (category) {
        const posts = await this.postRepo
          .createQueryBuilder('post')
          .leftJoinAndSelect('post.category', 'category')
          .leftJoin('post_tag', 'pt', 'pt.post_id = post.id')
          .leftJoinAndMapMany('post.tags', Tag, 'tags', 'tags.id = pt.tag_id')
          .where('category.id = :id', { id })
          .distinct(true)
          .getMany();
        return {
          message: '查询成功',
          posts,
        };
      }
      return {
        message: '分类不存在',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 删除文章
  async remove(id: string) {
    try {
      const post = await this.postRepo.findOne({
        where: { id },
        relations: ['tags'],
      });
      if (!post) {
        return { message: '文章不存在' };
      }
      if (post.tags && post.tags.length) {
        const tagIds = post.tags.map((t) => t.id);
        await this.postRepo
          .createQueryBuilder()
          .relation(Post, 'tags')
          .of(id)
          .remove(tagIds);
      }
      await this.postRepo.delete(id);
      return { message: '删除成功' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 检查文章是否存在
  async checkPostExist(id: string) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (post) {
      return {
        isExist: true,
        post,
      };
    }
    return {
      isExist: false,
    };
  }

  // 更新文章
  async update(updatePostDto: UpdatePostDto) {
    try {
      const { id, title, summary, content, cover, status, categoryId, tagIds } =
        updatePostDto;
      const { isExist, post } = await this.checkPostExist(id);
      if (!isExist) throw new NotFoundException('文章不存在');
      await this.postRepo.update(id, {
        title,
        summary,
        content,
        cover: cover ?? '',
        status: status ?? 0,
        category: {
          id: categoryId,
        },
      });

      const oldTagIds = post?.tags?.map((t) => t.id) ?? [];
      const newTagIds = Array.from(new Set(tagIds ?? []));
      // 把旧标签中不在新标签中的删除
      const toRemove = oldTagIds.filter((t) => !newTagIds.includes(t));
      // 把新标签中不在旧标签中的添加
      const toAdd = newTagIds.filter((t) => !oldTagIds.includes(t));
      if (toRemove.length) {
        await this.postRepo
          .createQueryBuilder()
          .relation(Post, 'tags')
          .of(id)
          .remove(toRemove);
      }
      if (toAdd.length) {
        await this.postRepo
          .createQueryBuilder()
          .relation(Post, 'tags')
          .of(id)
          .add(toAdd);
      }
      return { message: '更新成功' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 文章点赞
  async like(id: string) {
    try {
      const { isExist } = await this.checkPostExist(id);
      if (!isExist) throw new NotFoundException('文章不存在');
      await this.postRepo.update(id, {
        // 原子操作，点赞数加1
        likeCount: () => 'likeCount + 1',
      });
      return { message: '点赞成功' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 文章预览量
  async preview(id: string) {
    try {
      const { isExist } = await this.checkPostExist(id);
      if (!isExist) throw new NotFoundException('文章不存在');
      await this.postRepo.update(id, {
        viewCount: () => 'viewCount + 1',
      });
      return { message: '预览成功' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
