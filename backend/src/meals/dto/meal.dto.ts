import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { MealType } from '../meal.entity';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export class CreateMealDto {
  @Matches(DATE_RE, { message: '날짜는 YYYY-MM-DD 형식이어야 합니다.' })
  date!: string;

  @IsEnum(MealType, { message: '올바른 급식 종류가 아닙니다.' })
  type!: MealType;

  @IsArray()
  @IsString({ each: true })
  menu!: string[];

  @IsOptional()
  @IsString()
  allergy?: string | null;

  @IsOptional()
  @IsString()
  kcal?: string | null;
}

export class UpdateMealDto {
  @IsOptional()
  @Matches(DATE_RE, { message: '날짜는 YYYY-MM-DD 형식이어야 합니다.' })
  date?: string;

  @IsOptional()
  @IsEnum(MealType)
  type?: MealType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  menu?: string[];

  @IsOptional()
  @IsString()
  allergy?: string | null;

  @IsOptional()
  @IsString()
  kcal?: string | null;
}

export class QueryMealDto {
  @IsOptional()
  @Matches(DATE_RE, { message: '날짜는 YYYY-MM-DD 형식이어야 합니다.' })
  from?: string;

  @IsOptional()
  @Matches(DATE_RE, { message: '날짜는 YYYY-MM-DD 형식이어야 합니다.' })
  to?: string;

  @IsOptional()
  @IsEnum(MealType)
  type?: MealType;
}
