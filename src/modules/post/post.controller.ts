import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@UsePipes(ValidationPipe)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    try {
      return this.postService.create(createPostDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 分页进行获取文章 每次返回10条
  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    try {
      return this.postService.findAll(page, pageSize);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 获取文章详情
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.postService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 根据分类获取文章
  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    try {
      return this.postService.findByCategory(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 删除文章
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.postService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 更新文章
  @Put()
  update(@Body() updatePostDto: UpdatePostDto) {
    try {
      return this.postService.update(updatePostDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 文章预览量
  @Get('preview/:id')
  preview(@Param('id') id: string) {
    try {
      return this.postService.preview(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('like/:id')
  like(@Param('id') id: string) {
    try {
      return this.postService.like(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
