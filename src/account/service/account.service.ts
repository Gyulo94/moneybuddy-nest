import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Account, Prisma } from '@prisma/client';
import { BankService } from 'src/bank/service/bank.service';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { UserSignupEvent } from 'src/global/event/user-signup.event';
import { ApiException } from 'src/global/exception/api.exception';
import { UserService } from 'src/user/service/user.service';
import { AccountRepository } from '../repository/account.repository';
import { AccountRequest } from '../request/account.request';
import { AccountResponse } from '../response/account.response';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userService: UserService,
    private readonly bankService: BankService,
  ) {}

  @OnEvent('user.signup')
  async handleUserSignupEvent(user: UserSignupEvent) {
    const accountRequest: AccountRequest = new AccountRequest();
    accountRequest.name = '현금지갑';
    accountRequest.accountType = '계좌';
    accountRequest.initialBalance = 0;
    accountRequest.currentBalance = 0;
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
    await this.userService.findById(userId);
    const newAccountModel: Account = await this.accountRepository.create(
      request.toModel(userId),
    );

    const response = AccountResponse.fromModel(newAccountModel);
    return response;
  }

  async findAccountsByUserId(userId: string): Promise<AccountResponse[]> {
    const response = await this.accountRepository.findAllByUserId(userId);
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
    await this.findById(id);
    const accountModel: Prisma.AccountUpdateInput = request.toModel(userId);
    const updatedAccount = await this.accountRepository.update(
      id,
      accountModel,
    );
    const response = AccountResponse.fromModel(updatedAccount);
    return response;
  }

  async deleteAccount(id: string): Promise<void> {
    await this.findById(id);
    await this.accountRepository.delete(id);
  }
}
