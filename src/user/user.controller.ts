import { Controller, Get, Param } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Get('me/:email')
  async getProfile(@Param('email') email: string) {
    return await this.userService.getProfile(email);
  }
}
