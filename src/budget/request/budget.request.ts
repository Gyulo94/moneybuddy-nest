import { Prisma } from '@prisma/client';
import { IsNumber, Min } from 'class-validator';

export class BudgetRequest {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  public toModel(userId?: string): Prisma.BudgetCreateInput {
    return {
      amount: this.amount,
      year: this.year,
      month: this.month,
      user: userId ? { connect: { id: userId } } : undefined,
    };
  }
}
