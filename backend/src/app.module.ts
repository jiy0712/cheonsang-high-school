import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildDataSourceOptions } from './database/data-source-options';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { MealsModule } from './meals/meals.module';
import { SchedulesModule } from './schedules/schedules.module';
import { HealthController } from './health.controller';
import { RootController } from './root.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...buildDataSourceOptions(),
        retryAttempts: 15,
        retryDelay: 1000,
      }),
    }),
    AuthModule,
    UsersModule,
    BoardsModule,
    MealsModule,
    SchedulesModule,
  ],
  controllers: [RootController, HealthController],
})
export class AppModule {}
