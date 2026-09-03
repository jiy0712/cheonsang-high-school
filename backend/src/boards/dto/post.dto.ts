import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostCategory } from '../post.entity';

export class CreatePostDto {
  @IsEnum(PostCategory, { message: '올바른 게시판 종류가 아닙니다.' })
  category!: PostCategory;

  @IsString()
  @IsNotEmpty({ message: '제목을 입력해 주세요.' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해 주세요.' })
  content!: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsBoolean()
  isImportant?: boolean;

  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsString()
  tag?: string | null;
}

export class UpdatePostDto {
  @IsOptional()
  @IsEnum(PostCategory)
  category?: PostCategory;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsBoolean()
  isImportant?: boolean;

  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsString()
  tag?: string | null;
}

export class QueryPostDto {
  @IsOptional()
  @IsEnum(PostCategory)
  category?: PostCategory;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}
