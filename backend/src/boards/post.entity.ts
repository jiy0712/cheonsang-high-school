import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PostCategory {
  NOTICE = 'notice',
  LETTER = 'letter',
  NEWS = 'news',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'varchar' })
  category!: PostCategory;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column()
  author!: string;

  @Column({ type: 'int', default: 0 })
  views!: number;

  @Column({ name: 'is_important', type: 'boolean', default: false })
  isImportant!: boolean;

  @Column({ type: 'varchar', nullable: true })
  image!: string | null;

  @Column({ type: 'varchar', nullable: true })
  tag!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
