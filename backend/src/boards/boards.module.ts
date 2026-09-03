import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './post.entity'
import { BoardsService } from './boards.service'
import { BoardsController } from './boards.controller'
import { NoticeScraperService } from './notice-scraper.service'

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [BoardsService, NoticeScraperService],
  controllers: [BoardsController],
})
export class BoardsModule {}
