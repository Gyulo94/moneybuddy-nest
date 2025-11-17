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
}
