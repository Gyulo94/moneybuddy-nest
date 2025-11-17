import { AccountType, Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AccountRequest {
  @IsString()
  name: string;

  @IsString()
  accountType: AccountType;

  @IsNumber()
  @Min(0)
  initialBalance: number;

  @IsString()
  bankId: string;

  @IsString()
  @IsOptional()
  accountNumber: string;

  public toModel(userId?: string): Prisma.AccountCreateInput {
    return {
      name: this.name,
      accountType: this.accountType,
      initialBalance: this.initialBalance,
      currentBalance: this.initialBalance,
      accountNumber: this.accountNumber,
      Bank: { connect: { id: this.bankId } },
      User: { connect: { id: userId } },
    };
  }
}
