import { Injectable, Logger } from '@nestjs/common';
import { Tag, Transaction } from '@prisma/client';
import { format } from 'date-fns';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import {
  extractYearMonth,
  getMonthEndDateTime,
  getMonthStartDateTime,
} from 'src/global/utils/date-time.utils';
import { TagService } from 'src/tag/service/tag.service';
import { UserService } from 'src/user/service/user.service';
import { TransactionRepository } from '../repository/transaction.repository';
import { ExpenseRequest } from '../request/expense.request';
import { IncomeRequest } from '../request/income.request';
import { ExpenseResponse } from '../response/expense.response';
import { IncomeResponse } from '../response/income.response';
import { TransactionByDateResponse } from '../response/trabsaction-by-date.response';

@Injectable()
export class TransactionService {
  private readonly LOGGER = new Logger(TransactionService.name);
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  @Transactional()
  async createExpense(
    request: ExpenseRequest,
    userId: string,
  ): Promise<ExpenseResponse> {
    this.LOGGER.log(
      `--------------------지출 생성 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 사용자 정보 조회 시작`);
    await this.userService.findById(userId);
    this.LOGGER.log(`2. 사용자 정보 조회 완료`);

    this.LOGGER.log(`3. 태그 저장 시작`);
    const newTags: Tag[] = await this.tagService.saveTags(request.tags, userId);
    this.LOGGER.log(`4. 태그 저장 완료`);

    this.LOGGER.log(`5. 지출 생성 시작`);
    const newExpense: Transaction = await this.transactionRepository.create(
      request.toModel(newTags, userId),
    );
    this.LOGGER.log(`6. 지출 생성 완료`);
    const response = ExpenseResponse.fromModel(newExpense);
    this.LOGGER.log(
      `--------------------지출 생성 서비스 종료--------------------`,
    );
    return response;
  }

  @Transactional()
  async createIncome(
    request: IncomeRequest,
    userId: string,
  ): Promise<IncomeResponse> {
    this.LOGGER.log(
      `--------------------수입 생성 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 사용자 정보 조회 시작`);
    await this.userService.findById(userId);
    this.LOGGER.log(`2. 사용자 정보 조회 완료`);
    this.LOGGER.log(`3. 태그 저장 시작`);
    const newTags: Tag[] = await this.tagService.saveTags(request.tags, userId);
    this.LOGGER.log(`4. 태그 저장 완료`);
    this.LOGGER.log(`5. 수입 생성 시작`);
    const newIncome: Transaction = await this.transactionRepository.create(
      request.toModel(newTags, userId),
    );
    this.LOGGER.log(`6. 수입 생성 완료`);
    const response = IncomeResponse.fromModel(newIncome);
    this.LOGGER.log(
      `--------------------수입 생성 서비스 종료--------------------`,
    );
    return response;
  }

  async findTransactionsByMonth(
    currentDate: string,
    userId: string,
  ): Promise<TransactionByDateResponse[]> {
    this.LOGGER.log(
      `--------------------월별 거래 내역 조회 서비스 실행--------------------`,
    );
    const { year, month } = extractYearMonth(currentDate);

    const startDateTime = getMonthStartDateTime(year, month);
    this.LOGGER.log(`1. 조회 시작날짜: ${year}-${month}`);
    const endDateTime = getMonthEndDateTime(year, month);
    this.LOGGER.log(`2. 조회 종료날짜: ${year}-${month}`);

    this.LOGGER.log(`3. 월별 거래 내역 조회 시작`);
    const transactions: Transaction[] =
      await this.transactionRepository.findMonthlyTransactionsWithDetails(
        userId,
        startDateTime,
        endDateTime,
      );
    this.LOGGER.log(`4. 월별 거래 내역 조회 완료`);
    return this.buildGroupedTransactions(transactions);
  }

  private buildGroupedTransactions(
    transactions: Transaction[],
  ): TransactionByDateResponse[] {
    const groupedByDate = transactions.reduce((acc, transaction) => {
      const dateString = format(transaction.transactionAt, 'yyyy-MM-dd');
      this.LOGGER.log(`5. 그룹화 기준 날짜: ${dateString}`);
      if (!acc.has(dateString)) {
        acc.set(dateString, []);
      }
      acc.get(dateString)?.push(transaction);
      return acc;
    }, new Map<string, Transaction[]>());

    const result: TransactionByDateResponse[] = [];

    this.LOGGER.log(`6. 그룹화된 거래 내역 응답 생성 시작`);
    Array.from(groupedByDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([dateString, transactionList]) => {
        const item: TransactionByDateResponse =
          TransactionByDateResponse.fromModel(dateString, transactionList);
        result.push(item);
        this.LOGGER.log(
          `7. 그룹화된 거래 내역 응답 추가: ${item.date} | ${item.totalAmount} | ${JSON.stringify(item.details.map((d) => d.description))}`,
        );
      });
    this.LOGGER.log(`8. 그룹화된 거래 내역 응답 생성 완료`);
    this.LOGGER.log(
      `9. 최종 응답: ${result.map((r) => r.date)} | ${JSON.stringify(result.map((r) => r.totalAmount))} | ${JSON.stringify(result.map((r) => r.details.map((d) => d.description)))}`,
    );

    this.LOGGER.log(
      `--------------------월별 거래 내역 조회 서비스 종료--------------------`,
    );
    return result;
  }
}
