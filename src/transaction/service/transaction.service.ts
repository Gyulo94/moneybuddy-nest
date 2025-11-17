import { Injectable, Logger } from '@nestjs/common';
import { Tag, Transaction } from '@prisma/client';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { TagService } from 'src/tag/service/tag.service';
import { UserService } from 'src/user/service/user.service';
import { TransactionRepository } from '../repository/transaction.repository';
import { ExpenseRequest } from '../request/expense.request';
import { ExpenseResponse } from '../response/expense.response';

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
    request: ExpenseRequest,
    userId: string,
  ): Promise<ExpenseResponse> {
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
    const response = ExpenseResponse.fromModel(newIncome);
    this.LOGGER.log(
      `--------------------수입 생성 서비스 종료--------------------`,
    );
    return response;
  }
}
