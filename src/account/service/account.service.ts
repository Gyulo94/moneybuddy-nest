import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Account, AccountType, Prisma } from '@prisma/client';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { UserSignupEvent } from 'src/global/event/user-signup.event';
import { ApiException } from 'src/global/exception/api.exception';
import { UserService } from 'src/user/service/user.service';
import { AccountRepository } from '../repository/account.repository';
import { AccountRequest } from '../request/account.request';
import { AccountResponse } from '../response/account.response';

@Injectable()
export class AccountService {
  private readonly LOGGER = new Logger(AccountService.name);
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userService: UserService,
  ) {}

  @OnEvent('user.signup')
  async handleUserSignupEvent(user: UserSignupEvent) {
    const accountRequest: AccountRequest = new AccountRequest();
    accountRequest.name = '현금지갑';
    accountRequest.accountType = AccountType.현금;
    accountRequest.initialBalance = 0;
    accountRequest.bankId = 'd6c2a8f3-8b7c-4e0a-9d1b-3c5f7e9a0d2f';
    accountRequest.accountNumber = null;

    try {
      await this.createAccount(accountRequest, user.id);
    } catch (error) {
      throw new ApiException(ErrorCode.CREATE_ACCOUNT_FAILED);
    }
  }

  async createAccount(
    request: AccountRequest,
    userId: string,
  ): Promise<AccountResponse> {
    this.LOGGER.log(
      `--------------------계좌 생성 서비스 실행--------------------`,
    );
    await this.userService.findById(userId);
    this.LOGGER.log(`1. 유저 존재 여부 확인 완료`);
    const newAccountModel: Account = await this.accountRepository.create(
      request.toModel(userId),
    );
    this.LOGGER.log(`2. 계좌 생성 완료`);

    const response = AccountResponse.fromModel(newAccountModel);
    this.LOGGER.log(
      `--------------------계좌 생성 서비스 종료--------------------`,
    );
    return response;
  }

  async findAccountsByUserId(userId: string): Promise<AccountResponse[]> {
    this.LOGGER.log(
      `--------------------계좌 조회 서비스 실행--------------------`,
    );
    await this.userService.findById(userId);
    this.LOGGER.log(`1. 유저 존재 여부 확인 완료`);
    const accounts: Account[] =
      await this.accountRepository.findAllByUserId(userId);
    const response: AccountResponse[] = accounts.map((account) =>
      AccountResponse.fromModel(account),
    );
    this.LOGGER.log(`2. 계좌 조회 완료`);
    this.LOGGER.log(
      `--------------------계좌 조회 서비스 종료--------------------`,
    );
    return response;
  }

  async findById(id: string): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new ApiException(ErrorCode.ACCOUNT_NOT_FOUND);
    }
    return account;
  }

  async updateAccount(
    request: AccountRequest,
    id: string,
    userId: string,
  ): Promise<AccountResponse> {
    this.LOGGER.log(
      `--------------------계좌 수정 서비스 실행--------------------`,
    );
    await this.findById(id);
    this.LOGGER.log(`1. 계좌 존재 여부 확인 완료`);
    const accountModel: Prisma.AccountUpdateInput = request.toModel(userId);
    this.LOGGER.log(`2. 계좌 수정 모델 생성 완료`);
    const updatedAccount = await this.accountRepository.update(
      id,
      accountModel,
    );
    const response = AccountResponse.fromModel(updatedAccount);
    this.LOGGER.log(`3. 계좌 수정 완료`);
    this.LOGGER.log(
      `--------------------계좌 수정 서비스 종료--------------------`,
    );
    return response;
  }

  async deleteAccount(id: string): Promise<void> {
    this.LOGGER.log(
      `--------------------계좌 삭제 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 계좌 존재 여부 확인 완료`);
    await this.findById(id);
    await this.accountRepository.delete(id);
    this.LOGGER.log(`2. 계좌 삭제 완료`);
    this.LOGGER.log(
      `--------------------계좌 삭제 서비스 종료--------------------`,
    );
  }
}
