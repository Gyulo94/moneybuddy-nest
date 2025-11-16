import { Injectable } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class BankRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Bank> {
    const bank = await this.prisma.bank.findUnique({
      where: { id },
    });
    return bank;
  }

  async findAll(): Promise<Bank[]> {
    const banks = await this.prisma.bank.findMany();
    return banks;
  }
}
