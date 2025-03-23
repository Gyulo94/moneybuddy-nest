import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [JwtService, PrismaService, Logger],
  exports: [JwtService, PrismaService, Logger],
})
export class CommonModule {}
