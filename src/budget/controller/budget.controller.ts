import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Message } from 'src/global/decorator/message.decorator';
import { ResponseMessage } from 'src/global/enum/response-message.enum';
import { Payload } from 'src/global/types';
import { BudgetRequest } from '../request/budget.request';
import { BudgetResponse } from '../response/budget.response';
import { BudgetService } from '../service/budget.service';

@Controller('budget')
export class BudgetController {
  private readonly LOGGER = new Logger(BudgetController.name);
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create')
  @Message(ResponseMessage.CREATE_BUDGET_SUCCESS)
  async createBudget(
    @Body() request: BudgetRequest,
    @CurrentUser() user: Payload,
  ): Promise<BudgetResponse> {
    const response: BudgetResponse = await this.budgetService.createBudget(
      request,
      user.id,
    );
    return response;
  }

  @Get()
  async findBudget(
    @Query() { year, month }: { year: number; month: number },
    @CurrentUser() user: Payload,
  ): Promise<BudgetResponse> {
    const response: BudgetResponse = await this.budgetService.findBudget(
      +year,
      +month,
      user.id,
    );
    return response;
  }
}
