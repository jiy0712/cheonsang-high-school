import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostCategory } from './post.entity';
import { CreatePostDto, UpdatePostDto, QueryPostDto } from './dto/post.dto';
import { NoticeScraperService } from './notice-scraper.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
    private readonly noticeScraper: NoticeScraperService,
  ) {}

  async list(query: QueryPostDto): Promise<{
    items: Post[];
    total: number;
    page: number;
    limit: number;
  }> {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;

    const qb = this.postsRepo
      .createQueryBuilder('post')
      .orderBy('post.isImportant', 'DESC')
      .addOrderBy('post.createdAt', 'DESC');

    if (query.category) {
      qb.andWhere('post.category = :category', { category: query.category });
    }

    const q = query.q?.trim();
    if (q) {
      qb.andWhere('(post.title ILIKE :kw OR post.content ILIKE :kw)', {
        kw: `%${q}%`,
      });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    const scrapeable =
      !query.q &&
      (query.category === PostCategory.NOTICE ||
        query.category === PostCategory.LETTER);
    if (scrapeable) {
      const scraped =
        query.category === PostCategory.NOTICE
          ? await this.noticeScraper.fetchNotices(50)
          : await this.noticeScraper.fetchLetters(50);
      const start = (page - 1) * limit;
      return {
        items: scraped.slice(start, start + limit),
        total: scraped.length,
        page,
        limit,
      };
    }

    return { items, total, page, limit };
  }

  async get(id: number): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    await this.postsRepo.increment({ id }, 'views', 1);
    post.views += 1;
    return post;
  }

  async create(dto: CreatePostDto, authorName: string): Promise<Post> {
    const post = this.postsRepo.create({
      category: dto.category,
      title: dto.title,
      content: dto.content,
      author: dto.author ?? authorName,
      isImportant: dto.isImportant ?? false,
      image: dto.image ?? null,
      tag: dto.tag ?? null,
    });
    return this.postsRepo.save(post);
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    Object.assign(post, dto);
    return this.postsRepo.save(post);
  }

  async remove(id: number): Promise<{ success: true }> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    await this.postsRepo.remove(post);
    return { success: true };
  }

  async latestByCategory(category: PostCategory, limit = 4): Promise<Post[]> {
    const { items } = await this.list({ category, limit });
    return items;
  }

  async listAlbum(limit = 12) {
    return this.noticeScraper.fetchAlbum(limit);
  }
}
