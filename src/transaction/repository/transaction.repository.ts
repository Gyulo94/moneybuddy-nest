import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    const newTransaction = await this.prisma.transaction.create({
      data,
      include: {
        Account: true,
        PaymentMethod: true,
        tags: true,
        Category: true,
        SubCategory: true,
      },
    });
    return newTransaction;
  }

  async findMonthlyTransactionsWithDetails(
    userId: string,
    startDateTime: Date,
    endDateTime: Date,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
      },
      include: {
        Account: true,
        PaymentMethod: true,
        tags: true,
        Category: true,
        SubCategory: true,
      },
    });
    return transactions;
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id },
      include: {
        Account: true,
        PaymentMethod: true,
        tags: true,
        Category: true,
        SubCategory: true,
      },
    });
    return transaction;
  }

  async update(
    id: string,
    data: Prisma.TransactionUpdateInput,
  ): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data,
      include: {
        Account: true,
        PaymentMethod: true,
        tags: true,
        Category: true,
        SubCategory: true,
      },
    });
    return updatedTransaction;
  }
}
