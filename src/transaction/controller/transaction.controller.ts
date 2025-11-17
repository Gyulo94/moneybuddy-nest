import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Message } from 'src/global/decorator/message.decorator';
import { ResponseMessage } from 'src/global/enum/response-message.enum';
import { Payload } from 'src/global/types';
import { ExpenseRequest } from '../request/expense.request';
import { IncomeRequest } from '../request/income.request';
import { ExpenseResponse } from '../response/expense.response';
import { IncomeResponse } from '../response/income.response';
import { TransactionByDateResponse } from '../response/trabsaction-by-date.response';
import { TransactionDetailResponse } from '../response/transaction-detail.response';
import { TransactionService } from '../service/transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly LOGGER = new Logger(TransactionController.name);
  constructor(private readonly transactionService: TransactionService) {}

  @Post('expense/create')
  @Message(ResponseMessage.CREATE_EXPENSE_SUCCESS)
  async createExpense(
    @Body() request: ExpenseRequest,
    @CurrentUser() user: Payload,
  ): Promise<ExpenseResponse> {
    this.LOGGER.log(
      `--------------------지출 생성 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`지출 생성 요청 받음`);
    const response: ExpenseResponse =
      await this.transactionService.createExpense(request, user.id);
    this.LOGGER.log(`지출 생성 완료`);
    this.LOGGER.log(
      `--------------------지출 생성 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Post('income/create')
  @Message(ResponseMessage.CREATE_INCOME_SUCCESS)
  async createIncome(
    @Body() request: IncomeRequest,
    @CurrentUser() user: Payload,
  ): Promise<IncomeResponse> {
    this.LOGGER.log(
      `--------------------수입 생성 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`수입 생성 요청 받음`);
    const response: IncomeResponse = await this.transactionService.createIncome(
      request,
      user.id,
    );
    this.LOGGER.log(`수입 생성 완료`);
    this.LOGGER.log(
      `--------------------수입 생성 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Get('monthly')
  async findTransactionsByMonth(
    @Query('currentDate') currentDate: string,
    @CurrentUser() user: Payload,
  ): Promise<TransactionByDateResponse[]> {
    this.LOGGER.log(
      `--------------------월별 거래 내역 조회 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`월별 거래 내역 조회 요청 받음`);
    const response: TransactionByDateResponse[] =
      await this.transactionService.findTransactionsByMonth(
        currentDate,
        user.id,
      );
    this.LOGGER.log(`월별 거래 내역 조회 완료`);
    this.LOGGER.log(
      `--------------------월별 거래 내역 조회 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Get(':id')
  async findTransactionById(
    @Param('id') id: string,
    @CurrentUser() user: Payload,
  ): Promise<TransactionDetailResponse> {
    this.LOGGER.log(
      `--------------------거래 내역 상세 조회 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`거래 내역 상세 조회 요청 받음`);
    const response: TransactionDetailResponse =
      await this.transactionService.findById(id);
    this.LOGGER.log(`거래 내역 상세 조회 완료`);
    this.LOGGER.log(
      `--------------------거래 내역 상세 조회 컨트롤러 종료--------------------`,
    );
    return response;
  }
}
