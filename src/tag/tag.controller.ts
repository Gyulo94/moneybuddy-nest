import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post(':userId')
  create(@Body() dto: CreateTagDto, @Param('userId') userId: string) {
    return this.tagService.create(dto, userId);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.tagService.findAll(userId);
  }
}
