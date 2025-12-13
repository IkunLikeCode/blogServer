import {
  Controller,
  Post,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ParseIntPipe } from '@nestjs/common';
@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  createReply(@Body() createReplyDto: CreateReplyDto) {
    try {
      return this.replyService.createReply(createReplyDto);
    } catch (error) {
      throw new HttpException('创建回复评论失败', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  removeReply(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.replyService.removeReply(id);
    } catch (error) {
      throw new HttpException('删除回复评论失败', HttpStatus.BAD_REQUEST);
    }
  }
}
