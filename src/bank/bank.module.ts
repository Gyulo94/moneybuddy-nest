import { Module } from '@nestjs/common';
import { BankController } from './controller/bank.controller';
import { BankRepository } from './repository/bank.repository';
import { BankService } from './service/bank.service';

@Module({
  controllers: [BankController],
  providers: [BankService, BankRepository],
  exports: [BankService],
})
export class BankModule {}
