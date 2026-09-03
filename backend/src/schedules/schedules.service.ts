import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  QueryScheduleDto,
} from './dto/schedule.dto';
import { NeisScheduleService } from './neis-schedule.service';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly schedulesRepo: Repository<Schedule>,
    private readonly neis: NeisScheduleService,
  ) {}

  async list(query: QueryScheduleDto): Promise<Schedule[]> {
    if (query.date) {
      const rows = await this.schedulesRepo.find({
        where: { date: query.date },
        order: { time: 'ASC', id: 'ASC' },
      });
      if (rows.length > 0) return rows;
      return this.neis.fetchByDate(query.date);
    }
    if (query.year && query.month) {
      const mm = String(query.month).padStart(2, '0');
      const start = `${query.year}-${mm}-01`;
      const lastDay = new Date(query.year, query.month, 0).getDate();
      const end = `${query.year}-${mm}-${String(lastDay).padStart(2, '0')}`;
      const rows = await this.schedulesRepo.find({
        where: { date: Between(start, end) },
        order: { date: 'ASC', time: 'ASC' },
      });
      if (rows.length > 0) return rows;
      return this.neis.fetchRange(start, end);
    }
    return this.schedulesRepo.find({ order: { date: 'ASC', time: 'ASC' } });
  }

  async upcoming(limit = 4): Promise<Schedule[]> {
    const today = new Date().toISOString().slice(0, 10);
    const rows = await this.schedulesRepo.find({
      where: { date: Between(today, '9999-12-31') },
      order: { date: 'ASC' },
      take: limit,
    });
    if (rows.length > 0) return rows;
    return this.neis.fetchUpcoming(limit);
  }

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.schedulesRepo.create({
      date: dto.date,
      time: dto.time ?? null,
      title: dto.title,
      place: dto.place ?? null,
      type: dto.type,
      description: dto.description ?? null,
    });
    return this.schedulesRepo.save(schedule);
  }

  async update(id: number, dto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.schedulesRepo.findOne({ where: { id } });
    if (!schedule) throw new NotFoundException('일정을 찾을 수 없습니다.');
    Object.assign(schedule, dto);
    return this.schedulesRepo.save(schedule);
  }

  async remove(id: number): Promise<{ success: true }> {
    const schedule = await this.schedulesRepo.findOne({ where: { id } });
    if (!schedule) throw new NotFoundException('일정을 찾을 수 없습니다.');
    await this.schedulesRepo.remove(schedule);
    return { success: true };
  }
}
