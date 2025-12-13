import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('reply')
export class Reply {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, comment: '回复者昵称（匿名）' })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '回复者邮箱（可选）',
  })
  email: string;

  @Column({ type: 'text', comment: '回复内容' })
  content: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-正常，0-已删除' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '回复时间' })
  createdAt: Date;

  // 关系：一个回复属于一个评论（多对一）
  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;
}
