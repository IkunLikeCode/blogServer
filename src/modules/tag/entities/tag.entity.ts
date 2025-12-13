import { Post } from 'src/modules/post/entities/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

@Entity('Tag')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '标签名称唯一',
  })
  tagName: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createAt: Date;
  // 关系：多个标签关联多篇文章（多对多），自动生成中间表post_tag
  @ManyToMany(() => Post, (post) => post.tags)
  @JoinTable({
    name: 'post_tag',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  posts: Post[];
}
