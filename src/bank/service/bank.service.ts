import { Injectable, Logger } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { ApiException } from 'src/global/exception/api.exception';
import { BankRepository } from '../repository/bank.repository';
import { BankResponse } from '../response/bank.response';

@Injectable()
export class BankService {
  private readonly LOGGER = new Logger(BankService.name);
  constructor(private readonly bankRepository: BankRepository) {}

  async findAll(): Promise<BankResponse[]> {
    this.LOGGER.log(
      `--------------------은행 전체 조회 서비스 실행--------------------`,
    );
    const banks: Bank[] = await this.bankRepository.findAll();
    const response = banks.map((bank) => BankResponse.fromModel(bank));
    this.LOGGER.log(`은행 전체 조회 완료`);
    this.LOGGER.log(
      `--------------------은행 전체 조회 서비스 종료--------------------`,
    );
    return response;
  }

  async findById(id: string): Promise<BankResponse> {
    this.LOGGER.log(
      `--------------------은행 조회 서비스 실행--------------------`,
    );
    const bank: Bank = await this.bankRepository.findById(id);
    if (!bank) {
      throw new ApiException(ErrorCode.BANK_NOT_FOUND);
    }
    const response: BankResponse = BankResponse.fromModel(bank);
    this.LOGGER.log(`은행 조회 완료`);
    this.LOGGER.log(
      `--------------------은행 조회 서비스 종료--------------------`,
    );
    return response;
  }
}
