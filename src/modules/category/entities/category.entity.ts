import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 50,
    unique: false,
    comment: '分类名称（唯一）',
  })
  categoryName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '分类描述',
  })
  description: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updateAt: Date;

  // 关系：一个分类包含多篇文章（一对多）
  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
