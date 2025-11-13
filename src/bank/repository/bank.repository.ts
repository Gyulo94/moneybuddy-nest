import { Injectable } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class BankRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Bank[]> {
    const response: Bank[] = await this.prisma.bank.findMany();
    return response;
  }
}
