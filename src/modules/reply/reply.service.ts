import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
  ) {}

  // 创建回复评论
  createReply(createReplyDto: CreateReplyDto) {
    try {
      const reply = this.replyRepository.create({
        ...createReplyDto,
        status: 1,
        comment: {
          id: createReplyDto.commentId,
        },
      });
      return this.replyRepository.save(reply);
    } catch (error) {
      throw new HttpException('创建回复评论失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 删除回复评论
  removeReply(id: number) {
    try {
      return this.replyRepository.delete(id);
    } catch (error) {
      throw new HttpException('删除回复评论失败', HttpStatus.BAD_REQUEST);
    }
  }
}
