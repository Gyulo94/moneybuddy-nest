import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Payload } from 'src/global/types';
import { TagService } from '../service/tag.service';
import { TagResponse } from './response/tag.response';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  async findAllByUserId(@CurrentUser() user: Payload): Promise<TagResponse[]> {
    const response = await this.tagService.findAllByUserId(user.id);
    return response;
  }
}
