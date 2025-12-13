import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@UsePipes(ValidationPipe)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  // 创建评论
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    try {
      return this.commentService.create(createCommentDto);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  // 删除评论
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.commentService.remove(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
