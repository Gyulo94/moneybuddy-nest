import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Payload } from 'src/global/types/payload';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUser() user: Payload) {
    return await this.userService.getMe(user.id);
  }
}
