import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Schedule } from './schedule.entity'
import { SchedulesService } from './schedules.service'
import { SchedulesController } from './schedules.controller'
import { NeisScheduleService } from './neis-schedule.service'

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  providers: [SchedulesService, NeisScheduleService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
