import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AccountRequest {
  @IsString()
  name: string;

  @IsString()
  accountType: string;

  @IsNumber()
  initialBalance: number;

  @IsNumber()
  currentBalance: number;

  @IsString()
  bankId: string;

  @IsString()
  @IsOptional()
  accountNumber: string;

  public toModel(userId: string): Prisma.AccountCreateInput {
    return {
      name: this.name,
      accountType: this.accountType,
      initialBalance: this.initialBalance,
      currentBalance: this.currentBalance,
      accountNumber: this.accountNumber,
      Bank: { connect: { id: this.bankId } },
      User: { connect: { id: userId } },
    };
  }
}
