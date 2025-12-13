import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { OssService } from '../oss/oss.service';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import crypto from 'crypto';
import path from 'path';
import { Repository } from 'typeorm';
@Injectable()
export class FileService {
  protected bucketName = 'blog123';
  constructor(
    private readonly ossService: OssService,
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}
  async uploadFile(file: Express.Multer.File, createFIleDot: CreateFileDto) {
    try {
      const fileExt = path.extname(file.originalname);
      const fileName = `${crypto.randomBytes(8).toString('hex')}${fileExt}`;
      const fileUrl = `https://${this.bucketName}.tos-cn-beijing.volces.com/${fileName}`;
      const uploadResult = await this.ossService.OssClient.putObject({
        bucket: this.bucketName,
        key: fileName,
        body: file.buffer,
      });
      const fileEntity = this.fileRepository.create({
        fileName: fileName,
        filePath: fileUrl,
      });
      await this.fileRepository.save(fileEntity);
      return {
        filePath: fileUrl,
        message: '上传成功',
      };
    } catch (error) {
      throw new HttpException(
        error.message || '上传失败',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
