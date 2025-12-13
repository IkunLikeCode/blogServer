import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, comment: '文章标题', nullable: false, collation: 'utf8mb4_unicode_ci' })
  title: string;

  @Column({ type: 'varchar', length: 50, comment: '文章摘要', nullable: false, collation: 'utf8mb4_unicode_ci' })
  summary: string;

  @Column({ type: 'longtext', comment: '支持Markdown格式', nullable: false, collation: 'utf8mb4_unicode_ci' })
  content: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '文章封面',
    nullable: false,
    collation: 'utf8mb4_unicode_ci',
  })
  cover: string;

  @Column({ type: 'int', default: 0, comment: '文章阅读量' })
  viewCount: number;

  @Column({ type: 'int', default: 0, comment: '文章点赞量' })
  likeCount: number;

  @Column({ type: 'int', default: '0', comment: '状态 1-发布 0-草稿' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updateAt: Date;

  // 关系：多篇文章属于一个分类（多对一）
  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  // 关系：一篇文章关联多个标签（多对多），自动生成中间表post_tag
  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags: Tag[];

  // 关系：一篇文章有多个评论（一对多）
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
