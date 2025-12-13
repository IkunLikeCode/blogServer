import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpException,
  ValidationPipe,
  Query,
  UsePipes,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@UsePipes(ValidationPipe)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    try {
      return this.tagService.create(createTagDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    try {
      return this.tagService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  remove(@Query('id') id: string) {
    try {
      return this.tagService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  update(@Body() updateTagDto: UpdateTagDto) {
    try {
      return this.tagService.update(updateTagDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
