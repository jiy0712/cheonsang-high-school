import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Meal, MealType } from './meal.entity';
import { CreateMealDto, UpdateMealDto, QueryMealDto } from './dto/meal.dto';
import { NeisMealService } from './neis-meal.service';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealsRepo: Repository<Meal>,
    private readonly neis: NeisMealService,
  ) {}

  async list(query: QueryMealDto): Promise<Meal[]> {
    const qb = this.mealsRepo
      .createQueryBuilder('meal')
      .orderBy('meal.date', 'ASC')
      .addOrderBy('meal.type', 'ASC');

    if (query.from && query.to) {
      qb.andWhere('meal.date BETWEEN :from AND :to', {
        from: query.from,
        to: query.to,
      });
    }
    if (query.type) {
      qb.andWhere('meal.type = :type', { type: query.type });
    }
    const rows = await qb.getMany();

    if (rows.length > 0 || !query.from || !query.to) return rows;

    const external = await this.neis.fetchRange(query.from, query.to);
    return query.type
      ? external.filter((m) => m.type === query.type)
      : external;
  }

  async findByDate(date: string): Promise<Meal[]> {
    const rows = await this.mealsRepo.find({
      where: { date },
      order: { type: 'ASC' },
    });
    if (rows.length > 0) return rows;
    return this.neis.fetchByDate(date);
  }

  async findTodayLunch(): Promise<Meal | null> {
    const today = new Date().toISOString().slice(0, 10);

    const todayLunch = await this.mealsRepo.findOne({
      where: { date: today, type: MealType.LUNCH },
    });
    if (todayLunch) return todayLunch;

    const external = await this.neis.fetchLunch(today);
    if (external) return external;

    const upcoming = await this.mealsRepo.find({
      where: { date: Between(today, '9999-12-31'), type: MealType.LUNCH },
      order: { date: 'ASC' },
      take: 1,
    });
    return upcoming[0] ?? null;
  }

  async create(dto: CreateMealDto): Promise<Meal> {
    const existing = await this.mealsRepo.findOne({
      where: { date: dto.date, type: dto.type },
    });
    if (existing) {
      throw new ConflictException(
        '해당 날짜와 급식 종류의 식단이 이미 존재합니다.',
      );
    }
    const meal = this.mealsRepo.create({
      date: dto.date,
      type: dto.type,
      menu: dto.menu,
      allergy: dto.allergy ?? null,
      kcal: dto.kcal ?? null,
    });
    return this.mealsRepo.save(meal);
  }

  async update(id: number, dto: UpdateMealDto): Promise<Meal> {
    const meal = await this.mealsRepo.findOne({ where: { id } });
    if (!meal) throw new NotFoundException('급식 정보를 찾을 수 없습니다.');
    Object.assign(meal, dto);
    return this.mealsRepo.save(meal);
  }

  async remove(id: number): Promise<{ success: true }> {
    const meal = await this.mealsRepo.findOne({ where: { id } });
    if (!meal) throw new NotFoundException('급식 정보를 찾을 수 없습니다.');
    await this.mealsRepo.remove(meal);
    return { success: true };
  }
}
