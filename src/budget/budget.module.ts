import { Module } from '@nestjs/common';
import { BudgetController } from './controller/budget.controller';
import { BudgetRepository } from './repository/budget.repository';
import { BudgetService } from './service/budget.service';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository],
  exports: [BudgetService],
})
export class BudgetModule {}
