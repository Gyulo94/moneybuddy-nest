import { Controller, Get } from '@nestjs/common';
import { BankResponse } from '../response/bank.response';
import { BankService } from '../service/bank.service';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get('all')
  async findBanksAll(): Promise<BankResponse[]> {
    const response: BankResponse[] = await this.bankService.findAll();
    return response;
  }
}
