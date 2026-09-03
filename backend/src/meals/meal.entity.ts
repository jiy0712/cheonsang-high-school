import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MealType {
  BREAKFAST = 'breakfast', 
  LUNCH = 'lunch', 
  DINNER = 'dinner', 
}

@Entity('meals')
@Index(['date', 'type'], { unique: true })
export class Meal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar' })
  type!: MealType;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  menu!: string[];

  @Column({ type: 'varchar', nullable: true })
  allergy!: string | null;

  @Column({ type: 'varchar', nullable: true })
  kcal!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
