import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';
import { ScheduleType } from '../schedule.entity';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export class CreateScheduleDto {
  @Matches(DATE_RE, { message: '날짜는 YYYY-MM-DD 형식이어야 합니다.' })
  date!: string;

  @IsOptional()
  @IsString()
  time?: string | null;

  @IsString()
  @IsNotEmpty({ message: '일정 제목을 입력해 주세요.' })
  title!: string;

  @IsOptional()
  @IsString()
  place?: string | null;

  @IsOptional()
  @IsEnum(ScheduleType, { message: '올바른 일정 유형이 아닙니다.' })
  type?: ScheduleType;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class UpdateScheduleDto {
  @IsOptional()
  @Matches(DATE_RE, { message: '날짜는 YYYY-MM-DD 형식이어야 합니다.' })
  date?: string;

  @IsOptional()
  @IsString()
  time?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  place?: string | null;

  @IsOptional()
  @IsEnum(ScheduleType)
  type?: ScheduleType;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class QueryScheduleDto {
  @IsOptional()
  @Matches(DATE_RE, { message: '날짜는 YYYY-MM-DD 형식이어야 합니다.' })
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
}
