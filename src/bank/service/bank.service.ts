import { Injectable } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { ApiException } from 'src/global/exception/api.exception';
import { BankRepository } from '../repository/bank.repository';
import { BankResponse } from '../response/bank.response';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async findAll(): Promise<BankResponse[]> {
    const response: BankResponse[] = await this.bankRepository.findAll();
    return response;
  }

  async findById(id: string): Promise<Bank> {
    const response: Bank = await this.bankRepository.findById(id);
    if (!response) {
      throw new ApiException(ErrorCode.BANK_NOT_FOUND);
    }
    return response;
  }
}
