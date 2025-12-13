import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'file',
  comment: '文件表',
})
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '文件名称',
    collation: 'utf8mb4_unicode_ci',
  })
  fileName: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '文件路径',
    collation: 'utf8mb4_unicode_ci',
  })
  filePath: string;
}
