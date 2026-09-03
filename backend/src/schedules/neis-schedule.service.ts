import { Injectable, Logger } from '@nestjs/common';
import { Schedule, ScheduleType } from './schedule.entity';

@Injectable()
export class NeisScheduleService {
  private readonly logger = new Logger(NeisScheduleService.name);
  private readonly base = 'https://open.neis.go.kr/hub/SchoolSchedule';

  private get atptCode(): string {
    return process.env.NEIS_ATPT_OFCDC_CODE ?? 'H10';
  }
  private get schulCode(): string {
    return process.env.NEIS_SCHUL_CODE ?? '7480209';
  }

  private compact(date: string): string {
    return date.replace(/-/g, '');
  }
  private expand(ymd: string): string {
    return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
  }


  private toScheduleType(): ScheduleType {
    return ScheduleType.EVENT;
  }

  async fetchRange(fromYmd: string, toYmd: string): Promise<Schedule[]> {
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: '1',
      pSize: '200',
      ATPT_OFCDC_SC_CODE: this.atptCode,
      SD_SCHUL_CODE: this.schulCode,
      AA_FROM_YMD: this.compact(fromYmd),
      AA_TO_YMD: this.compact(toYmd),
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
        this.logger.warn(`NEIS 학사일정 응답 오류: HTTP ${res.status}`);
        return [];
      }
      json = await res.json();
    } catch (err) {
      this.logger.warn(`NEIS 학사일정 호출 실패: ${(err as Error).message}`);
      return [];
    }

    const rows = json?.SchoolSchedule?.[1]?.row;
    if (!Array.isArray(rows)) return [];

    return rows
      .map((row: any, i: number): Schedule | null => {
        const ymd = String(row.AA_YMD ?? '');
        if (ymd.length !== 8) return null;

        const title = String(row.EVENT_NM ?? '').trim();
        if (!title || title === '토요휴업일') return null;

        const cntnt = String(row.EVENT_CNTNT ?? '').trim();
        return {
          id: -(Number(`${ymd}${i}`) % 2147483647),
          date: this.expand(ymd),
          time: null,
          title,
          place: null,
          type: this.toScheduleType(),
          description: cntnt.length > 0 ? cntnt : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
      .filter((s): s is Schedule => s !== null);
  }

  async fetchByDate(date: string): Promise<Schedule[]> {
    return this.fetchRange(date, date);
  }

  async fetchUpcoming(limit = 4): Promise<Schedule[]> {
    const today = new Date();
    const to = new Date(today);
    to.setDate(to.getDate() + 120);
    const fromYmd = today.toISOString().slice(0, 10);
    const toYmd = to.toISOString().slice(0, 10);

    const all = await this.fetchRange(fromYmd, toYmd);
    return all
      .filter((s) => s.date >= fromYmd)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit);
  }
}
