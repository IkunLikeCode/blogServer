import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File } from './entities/file.entity';
import { OssModule } from '../oss/oss.module';
@Module({
  imports: [TypeOrmModule.forFeature([File]), OssModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
