import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { TagModule } from 'src/tag/tag.module';
import { UserModule } from 'src/user/user.module';
import { TransactionController } from './controller/transaction.controller';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionService } from './service/transaction.service';

@Module({
  imports: [UserModule, TagModule, AccountModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
