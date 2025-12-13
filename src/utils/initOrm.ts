import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/modules/post/entities/post.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Reply } from 'src/modules/reply/entities/reply.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { File } from 'src/modules/file/entities/file.entity';

export function initOrm() {
  return TypeOrmModule.forRoot({
    type: (process.env.DATABASE_TYPE as any) ?? 'mysql',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? '3306'),
    username: process.env.DATABASE_USER ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? 'yaobo20030902',
    database: process.env.DATABASE_NAME ?? 'jbook',
    entities: [Post, Category, Reply, Tag, Comment, File],
    synchronize: true,
    logging: ['error'],
  });
}
