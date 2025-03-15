import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService, PrismaService],
  controllers: [],
})
export class EmailModule {}
