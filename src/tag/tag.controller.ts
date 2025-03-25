import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.tagService.findAll(userId);
  }
}
