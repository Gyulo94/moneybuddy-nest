import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { EmailService } from './email.service';

@Module({
  imports: [CommonModule],
  providers: [EmailService],
  controllers: [],
})
export class EmailModule {}
