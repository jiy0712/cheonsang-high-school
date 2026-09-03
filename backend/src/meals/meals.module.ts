import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { Meal } from './meal.entity'
import { MealsService } from './meals.service'
import { MealsController } from './meals.controller'
import { NeisMealService } from './neis-meal.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Meal]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [MealsService, NeisMealService],
  controllers: [MealsController],
})
export class MealsModule {}
