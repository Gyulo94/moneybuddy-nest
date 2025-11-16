import { Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { AccountResponse } from '../response/account.response';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    const newAccount = await this.prisma.account.create({
      data,
      include: {
        Bank: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return newAccount;
  }

  async findAllByUserId(userId: string): Promise<AccountResponse[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        accountType: true,
        currentBalance: true,
        initialBalance: true,
        accountNumber: true,
        Bank: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            provider: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return accounts;
  }
}
