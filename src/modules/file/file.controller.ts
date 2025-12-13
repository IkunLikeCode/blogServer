import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pips/FileValidation.pipe';
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Body() createFileDot: CreateFileDto,
  ) {
    try {
      return this.fileService.uploadFile(file, createFileDot);
    } catch (error) {
      throw new HttpException(
        error.message || '上传失败',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
