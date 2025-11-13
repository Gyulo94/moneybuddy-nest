import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { CreateAccountRequest } from '../request/create-account.request';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: CreateAccountRequest, userId: string): Promise<Account> {
    const { bankId, ...rest } = data;
    const newAccount = await this.prisma.account.create({
      data: {
        ...rest,
        Bank: { connect: { id: bankId } },
        User: { connect: { id: userId } },
      },
    });
    return newAccount;
  }
}
