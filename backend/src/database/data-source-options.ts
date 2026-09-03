import { DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../boards/post.entity';
import { Meal } from '../meals/meal.entity';
import { Schedule } from '../schedules/schedule.entity';

export function buildDataSourceOptions(): DataSourceOptions {
  const url =
    process.env.DATABASE_URL ??
    'postgres://cheonsang:cheonsang@localhost:5432/cheonsang';

  const embedded = process.env.EMBEDDED_DB === 'true';

  return {
    type: 'postgres',
    url,
    entities: [User, Post, Meal, Schedule],
    synchronize: process.env.DB_SYNCHRONIZE !== 'false',
    logging: false,
    ...(embedded ? { poolSize: 1, extra: { max: 1 } } : {}),
  };
}
