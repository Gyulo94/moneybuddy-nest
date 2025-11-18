import { Budget } from '@prisma/client';
export class BudgetResponse {
  id: string;
  amount: number;
  year: number;
  month: number;
  createdAt: Date;
  updatedAt: Date;

  static fromModel(entity: Budget): BudgetResponse {
    const { id, amount, year, month, createdAt, updatedAt } = entity;
    return {
      id,
      amount,
      year,
      month,
      createdAt,
      updatedAt,
    };
  }
}
