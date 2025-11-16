import { Controller, Get, Logger } from '@nestjs/common';
import { BankResponse } from '../response/bank.response';
import { BankService } from '../service/bank.service';

@Controller('bank')
export class BankController {
  private readonly LOGGER = new Logger(BankController.name);
  constructor(private readonly bankService: BankService) {}

  @Get('all')
  async findBanksAll(): Promise<BankResponse[]> {
    this.LOGGER.log(
      `--------------------은행 전체 조회 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`은행 전체 조회 요청 받음`);
    const response: BankResponse[] = await this.bankService.findAll();
    this.LOGGER.log(`은행 전체 조회 완료`);
    this.LOGGER.log(
      `--------------------은행 전체 조회 컨트롤러 종료--------------------`,
    );
    return response;
  }
}
