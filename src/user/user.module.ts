import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, EmailService],
})
export class UserModule {}
