import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post as HttpPost,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreatePostDto, UpdatePostDto, QueryPostDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '../users/user.entity';
import { AuthUser } from '../auth/jwt.strategy';

@Controller('boards/posts')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  list(@Query() query: QueryPostDto) {
    return this.boardsService.list(query);
  }

  @Get('album')
  album(@Query('limit') limit?: string) {
    return this.boardsService.listAlbum(limit ? Number(limit) : 12);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.get(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpPost()
  create(@Body() dto: CreatePostDto, @CurrentUser() user: AuthUser) {
    return this.boardsService.create(dto, user.name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return this.boardsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.remove(id);
  }
}
