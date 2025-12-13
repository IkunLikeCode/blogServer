import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { initOrm } from './utils/initOrm';
import { PostModule } from './modules/post/post.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { CommentModule } from './modules/comment/comment.module';
import { ReplyModule } from './modules/reply/reply.module';
import { FileModule } from './modules/file/file.module';
import { OssModule } from './modules/oss/oss.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    initOrm(),
    PostModule,
    CategoryModule,
    TagModule,
    CommentModule,
    ReplyModule,
    FileModule,
    OssModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
