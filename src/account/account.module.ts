import { Module } from '@nestjs/common';
import { BankModule } from 'src/bank/bank.module';
import { UserModule } from 'src/user/user.module';
import { AccountController } from './controller/account.controller';
import { AccountRepository } from './repository/account.repository';
import { AccountService } from './service/account.service';

@Module({
  imports: [UserModule, BankModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
