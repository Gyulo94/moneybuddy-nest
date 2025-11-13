import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { BankRepository } from '../repository/bank.repository';
import { BankResponse } from '../response/bank.response';

@Injectable()
export class BankService {
  constructor(
    private readonly bankRepository: BankRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<BankResponse[]> {
    const response: BankResponse[] = await this.bankRepository.findAll();
    return response;
  }
}
