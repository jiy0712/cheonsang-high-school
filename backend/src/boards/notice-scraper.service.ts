import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Post, PostCategory } from './post.entity';

export interface AlbumItem {
  id: number;
  title: string;
  image: string; 
  link: string; 
  date: string; 
}

@Injectable()
export class NoticeScraperService {
  private readonly logger = new Logger(NoticeScraperService.name);

  private get noticeUrl(): string {
    return (
      process.env.SCHOOL_NOTICE_URL ??
      'https://school.use.go.kr/cheonsang-h/M010301'
    );
  }
  private get letterUrl(): string {
    return (
      process.env.SCHOOL_LETTER_URL ??
      'https://school.use.go.kr/cheonsang-h/M0104'
    );
  }
  private get albumUrl(): string {
    return (
      process.env.SCHOOL_ALBUM_URL ??
      'https://school.use.go.kr/cheonsang-h/M01030401/list'
    );
  }
  private get baseUrl(): string {
    return process.env.SCHOOL_BASE_URL ?? 'https://school.use.go.kr';
  }
  private get proxyBase(): string | null {
    return process.env.SCHOOL_PROXY_BASE ?? null;
  }

  async fetchNotices(limit = 20): Promise<Post[]> {
    const html = await this.fetchHtml(this.noticeUrl);
    if (!html) return [];

    try {
      return this.parse(html, limit, PostCategory.NOTICE, '공지');
    } catch (err) {
      this.logger.warn(`공지 파싱 실패: ${(err as Error).message}`);
      return [];
    }
  }

  async fetchLetters(limit = 20): Promise<Post[]> {
    const html = await this.fetchHtml(this.letterUrl);
    if (!html) return [];

    try {
      return this.parse(html, limit, PostCategory.LETTER, '가정통신문');
    } catch (err) {
      this.logger.warn(`가정통신문 파싱 실패: ${(err as Error).message}`);
      return [];
    }
  }

  async fetchAlbum(limit = 12): Promise<AlbumItem[]> {
    const html = await this.fetchHtml(this.albumUrl);
    if (!html) return [];

    try {
      return this.parseAlbum(html, limit);
    } catch (err) {
      this.logger.warn(`앨범 파싱 실패: ${(err as Error).message}`);
      return [];
    }
  }

  private async fetchHtml(url: string): Promise<string | null> {
    const target = this.proxyBase
      ? `${this.proxyBase}${encodeURIComponent(url)}`
      : url;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(target, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        },
      });
      clearTimeout(timeout);
      if (!res.ok) {
        this.logger.warn(`학교 홈페이지 응답 오류: HTTP ${res.status}`);
        return null;
      }
      const body = await res.text();

      if (/blocked|방화벽|firewall|보안정책/i.test(body) && body.length < 2000) {
        this.logger.warn('학교 홈페이지 접근이 방화벽에 의해 차단되었습니다(해외 IP).');
        return null;
      }
      return body;
    } catch (err) {
      this.logger.warn(`학교 홈페이지 호출 실패: ${(err as Error).message}`);
      return null;
    }
  }

  private parse(
    html: string,
    limit: number,
    category: PostCategory,
    label: string,
  ): Post[] {
    const $ = cheerio.load(html);
    const results: Post[] = [];
    const seen = new Set<string>();

    const rows = $(
      'table tbody tr, table tr, ul.board-list li, .board_list li, .bbs-list li',
    );

    rows.each((_i, el) => {
      if (results.length >= limit) return;

      const $row = $(el);
      const $link = $row
        .find('a[href]')
        .filter((_j, a) => $(a).text().trim().length > 0)
        .first();
      const title = $link.text().replace(/\s+/g, ' ').trim();
      if (!title || title.length < 2) return;

      if (/^(제목|번호|작성자|첨부|조회|등록일)$/.test(title)) return;
      if (seen.has(title)) return;

      const rowText = $row.text();
      const dateMatch = rowText.match(
        /(20\d{2})[.\-/\s]\s*(\d{1,2})[.\-/\s]\s*(\d{1,2})/,
      );
      const createdAt = dateMatch
        ? new Date(
            Number(dateMatch[1]),
            Number(dateMatch[2]) - 1,
            Number(dateMatch[3]),
          )
        : new Date();

      const href = $link.attr('href') ?? '';
      const link = this.absolutize(href);

      const viewsMatch = rowText.match(/조회\s*(\d+)/);
      const views = viewsMatch ? Number(viewsMatch[1]) : 0;

      seen.add(title);
      results.push(
        this.toPost(
          title,
          link,
          createdAt,
          views,
          results.length,
          category,
          label,
        ),
      );
    });

    return results;
  }
ㅔ
  private parseAlbum(html: string, limit: number): AlbumItem[] {
    const $ = cheerio.load(html);

    const postLinkPattern = /\/M01030401\/view\/\d+/;
    const posts: { title: string; href: string }[] = [];
    const seenHrefs = new Set<string>();

    $('a[href]').each((_i, el) => {
      const href = $(el).attr('href') ?? '';
      if (!postLinkPattern.test(href)) return;

      const absoluteHref = this.absolutize(href);
      if (seenHrefs.has(absoluteHref)) return;

      const title = $(el).text().replace(/\s+/g, ' ').trim();
      if (!title) return;

      seenHrefs.add(absoluteHref);
      posts.push({ title, href: absoluteHref });
    });

    const images: string[] = [];
    $('img[src]').each((_i, el) => {
      const src = $(el).attr('src') ?? '';
      if (!src.includes('/files/')) return;
      images.push(this.absolutize(src));
    });

    const results: AlbumItem[] = [];
    for (let i = 0; i < posts.length && results.length < limit; i++) {
      const { title, href } = posts[i];
      const image = images[i];
      if (!image) continue; 

      const idMatch = href.match(/\/view\/(\d+)/);
      const id = idMatch ? -Number(idMatch[1]) : -(results.length + 1);

      const container = $(`a[href$="${href.split('/').pop()}"]`)
        .first()
        .closest('li, tr, div');
      const containerText = container.text();
      const dateMatch = containerText.match(
        /(20\d{2})[.\-/\s]\s*(\d{1,2})[.\-/\s]\s*(\d{1,2})/,
      );
      const dateObj = dateMatch
        ? new Date(
            Number(dateMatch[1]),
            Number(dateMatch[2]) - 1,
            Number(dateMatch[3]),
          )
        : new Date();

      results.push({
        id,
        title,
        image,
        link: href,
        date: dateObj.toISOString().slice(0, 10),
      });
    }

    return results;
  }

  private absolutize(href: string): string {
    if (!href || href.startsWith('#') || href.startsWith('javascript'))
      return this.noticeUrl;
    if (href.startsWith('http')) return href;
    if (href.startsWith('/')) return `${this.baseUrl}${href}`;
    return `${this.baseUrl}/${href}`;
  }

  private toPost(
    title: string,
    link: string,
    createdAt: Date,
    views: number,
    index: number,
    category: PostCategory,
    label: string,
  ): Post {
    const ymd = createdAt.toISOString().slice(0, 10).replace(/-/g, '');
    return {
      id: -(Number(`${ymd}${index}`) % 2147483647) - 1,
      category,
      title,
      content: `천상고등학교 공식 홈페이지 ${label}입니다.\n원문 보기: ${link}`,
      author: '천상고등학교',
      views,
      isImportant: false,
      image: null,
      tag: null,
      createdAt,
      updatedAt: createdAt,
    };
  }
}
