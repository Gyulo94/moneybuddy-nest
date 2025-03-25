import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [CommonModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
