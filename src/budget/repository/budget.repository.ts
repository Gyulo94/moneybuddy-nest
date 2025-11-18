import { Injectable } from '@nestjs/common';
import { Budget, Prisma } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BudgetCreateInput): Promise<Budget> {
    const newBudget = await this.prisma.budget.create({
      data,
    });
    return newBudget;
  }

  async findByYearAndMonthAndUserId(
    year: number,
    month: number,
    userId: string,
  ): Promise<Budget> {
    const budget = await this.prisma.budget.findFirst({
      where: {
        year,
        month,
        userId,
      },
    });
    return budget;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.budget.delete({
      where: {
        id,
      },
    });
  }
}
