import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
