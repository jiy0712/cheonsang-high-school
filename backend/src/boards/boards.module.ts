import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { Post } from './post.entity'
import { BoardsService } from './boards.service'
import { BoardsController } from './boards.controller'
import { NoticeScraperService } from './notice-scraper.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [BoardsService, NoticeScraperService],
  controllers: [BoardsController],
})
export class BoardsModule {}
