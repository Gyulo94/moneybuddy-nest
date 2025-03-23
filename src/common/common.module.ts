import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [JwtService, PrismaService],
  exports: [JwtService, PrismaService],
})
export class CommonModule {}
