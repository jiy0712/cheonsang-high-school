import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ScheduleType {
  EVENT = 'event',
  STUDENT = 'student',
  PARENT = 'parent',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', nullable: true })
  time!: string | null;

  @Column()
  title!: string;

  @Column({ type: 'varchar', nullable: true })
  place!: string | null;

  @Column({ type: 'varchar', default: ScheduleType.EVENT })
  type!: ScheduleType;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
