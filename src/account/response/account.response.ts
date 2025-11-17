import { Account } from '@prisma/client';
import { BankResponse } from 'src/bank/response/bank.response';
import { UserResponse } from 'src/user/response/user.response';

export class AccountResponse {
  id: string;
  name: string;
  accountType: string;
  initialBalance: number;
  currentBalance: number;
  bank?: BankResponse;
  user?: UserResponse;
  accountNumber: string;

  static fromModel(
    entity: Account & { Bank?: BankResponse; User?: UserResponse },
  ): AccountResponse {
    const {
      id,
      name,
      accountType,
      initialBalance,
      currentBalance,
      accountNumber,
      Bank: bank,
      User: user,
    } = entity;
    return {
      id,
      name,
      accountType,
      initialBalance,
      currentBalance,
      accountNumber,
      bank,
      user,
    } as AccountResponse;
  }
}
