import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { EmailService } from 'src/email/email.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
