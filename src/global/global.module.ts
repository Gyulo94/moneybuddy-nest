import { HttpModule } from '@nestjs/axios';
import { Global, Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ImageModule } from 'src/image/image.module';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  imports: [RedisModule, HttpModule, ImageModule],
  providers: [PrismaService, JwtService, Logger],
  exports: [
    PrismaService,
    JwtService,
    Logger,
    RedisModule,
    HttpModule,
    ImageModule,
  ],
})
export class GlobalModule {}
