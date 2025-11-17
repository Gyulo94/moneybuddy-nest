import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Message } from 'src/global/decorator/message.decorator';
import { ResponseMessage } from 'src/global/enum/response-message.enum';
import { Payload } from 'src/global/types';
import { ExpenseRequest } from '../request/expense.request';
import { ExpenseResponse } from '../response/expense.response';
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
    @Body() request: ExpenseRequest,
    @CurrentUser() user: Payload,
  ): Promise<ExpenseResponse> {
    this.LOGGER.log(
      `--------------------수입 생성 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`수입 생성 요청 받음`);
    const response: ExpenseResponse =
      await this.transactionService.createIncome(request, user.id);
    this.LOGGER.log(`수입 생성 완료`);
    this.LOGGER.log(
      `--------------------수입 생성 컨트롤러 종료--------------------`,
    );
    return response;
  }
}
