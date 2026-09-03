import { Injectable, Logger } from '@nestjs/common';
import { Meal, MealType } from './meal.entity';

@Injectable()
export class NeisMealService {
  private readonly logger = new Logger(NeisMealService.name);
  private readonly base = 'https://open.neis.go.kr/hub/mealServiceDietInfo';

  private get atptCode(): string {
    return process.env.NEIS_ATPT_OFCDC_CODE ?? 'H10';
  }
  private get schulCode(): string {
    return process.env.NEIS_SCHUL_CODE ?? '7480209';
  }

  private toMealType(code: string): MealType {
    if (code === '3') return MealType.DINNER;
    if (code === '1') return MealType.BREAKFAST;
    return MealType.LUNCH;
  }

  private parseMenu(raw: string): string[] {
    return raw
      .split('<br/>')
      .map((line) =>
        line
          .replace(/\s*\([\d.\s]*\)\s*$/g, '')
          .replace(/\s+/g, ' ')
          .trim(),
      )
      .filter((line) => line.length > 0);
  }

  private parseAllergy(raw: string): string | null {
    const nums = new Set<number>();
    const matches = raw.matchAll(/\(([\d.\s]+)\)/g);
    for (const m of matches) {
      for (const token of m[1].split('.')) {
        const n = Number(token.trim());
        if (Number.isInteger(n) && n > 0) nums.add(n);
      }
    }
    if (nums.size === 0) return null;
    return Array.from(nums)
      .sort((a, b) => a - b)
      .join(', ');
  }

  private parseKcal(raw: string | undefined): string | null {
    if (!raw) return null;
    const n = parseFloat(raw.replace(/[^\d.]/g, ''));
    if (Number.isNaN(n)) return null;
    return `${Math.round(n)} kcal`;
  }

  private compact(date: string): string {
    return date.replace(/-/g, '');
  }
  private expand(ymd: string): string {
    return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
  }

  async fetchRange(fromYmd: string, toYmd: string): Promise<Meal[]> {
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: '1',
      pSize: '100',
      ATPT_OFCDC_SC_CODE: this.atptCode,
      SD_SCHUL_CODE: this.schulCode,
      MLSV_FROM_YMD: this.compact(fromYmd),
      MLSV_TO_YMD: this.compact(toYmd),
    });
    const key = process.env.NEIS_API_KEY;
    if (key) params.set('KEY', key);

    let json: any;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`${this.base}?${params.toString()}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        this.logger.warn(`NEIS 응답 오류: HTTP ${res.status}`);
        return [];
      }
      json = await res.json();
    } catch (err) {
      this.logger.warn(`NEIS 호출 실패: ${(err as Error).message}`);
      return [];
    }

    const rows = json?.mealServiceDietInfo?.[1]?.row;
    if (!Array.isArray(rows)) return [];

    return rows.map((row: any, i: number): Meal => {
      const date = this.expand(String(row.MLSV_YMD));
      const type = this.toMealType(String(row.MMEAL_SC_CODE));
      const dish = String(row.DDISH_NM ?? '');
      return {
        id: -(Number(`${row.MLSV_YMD}${row.MMEAL_SC_CODE || i}`) % 2147483647),
        date,
        type,
        menu: this.parseMenu(dish),
        allergy: this.parseAllergy(dish),
        kcal: this.parseKcal(row.CAL_INFO),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }

  async fetchByDate(date: string): Promise<Meal[]> {
    return this.fetchRange(date, date);
  }

  async fetchLunch(date: string): Promise<Meal | null> {
    const meals = await this.fetchByDate(date);
    return meals.find((m) => m.type === MealType.LUNCH) ?? null;
  }
}
