import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from 'src/modules/post/entities/post.entity';
import { Reply } from 'src/modules/reply/entities/reply.entity';

@Entity('Comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '50', comment: '评论者的昵称', collation: 'utf8mb4_unicode_ci' })
  nickname: string;

  @Column({ type: 'varchar', length: '50', comment: '评论者的邮箱', collation: 'utf8mb4_unicode_ci' })
  email: string;

  @Column({ type: 'text', comment: '评论内容', collation: 'utf8mb4_unicode_ci' })
  content: string;

  @Column({ type: 'varchar', length: '255', comment: '评论者的IP地址', collation: 'utf8mb4_unicode_ci' })
  ip: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-正常，0-已删除' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createAt: Date;

  // 关系：一个评论属于一篇文章（多对一）
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  // 关系：一个评论有多个回复（一对多）
  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];
}
