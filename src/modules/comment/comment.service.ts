import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}
  // 创建评论
  create(createCommentDto: CreateCommentDto) {
    try {
      const comment = this.commentRepository.create({
        ...createCommentDto,
        status: 1,
        post: {
          id: createCommentDto.postId,
        },
      });
      return this.commentRepository.save(comment);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 删除评论
  remove(id: string) {
    try {
      return this.commentRepository.delete(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
