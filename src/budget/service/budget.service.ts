import { Injectable, Logger } from '@nestjs/common';
import { Budget } from '@prisma/client';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { ApiException } from 'src/global/exception/api.exception';
import { BudgetRepository } from '../repository/budget.repository';
import { BudgetRequest } from '../request/budget.request';
import { BudgetResponse } from '../response/budget.response';

@Injectable()
export class BudgetService {
  private readonly LOGGER = new Logger(BudgetService.name);
  constructor(private readonly budgetRepository: BudgetRepository) {}

  @Transactional()
  async createBudget(
    request: BudgetRequest,
    userId: string,
  ): Promise<BudgetResponse> {
    const { year, month } = request;
    const isExistingBudget =
      await this.budgetRepository.findByYearAndMonthAndUserId(
        year,
        month,
        userId,
      );

    if (isExistingBudget) {
      await this.budgetRepository.delete(isExistingBudget.id);
    }

    const newBudget: Budget = await this.budgetRepository.create(
      request.toModel(userId),
    );
    const response: BudgetResponse = BudgetResponse.fromModel(newBudget);
    return response;
  }

  async findBudget(
    year: number,
    month: number,
    userId: string,
  ): Promise<BudgetResponse> {
    const budget: Budget =
      await this.budgetRepository.findByYearAndMonthAndUserId(
        year,
        month,
        userId,
      );
    if (!budget) {
      throw new ApiException(ErrorCode.BUDGET_NOT_FOUND);
    }
    const response: BudgetResponse = BudgetResponse.fromModel(budget);
    return response;
  }
}
