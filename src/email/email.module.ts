import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { EmailService } from './email.service';

@Module({
  imports: [RedisModule],
  providers: [EmailService],
})
export class EmailModule {}
