import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { UserSignupEvent } from 'src/global/event/user-signup.event';
import { ApiException } from 'src/global/exception/api.exception';
import { UserService } from 'src/user/service/user.service';
import { AccountRepository } from '../repository/account.repository';
import { CreateAccountRequest } from '../request/create-account.request';
import { AccountResponse } from '../response/account.response';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userService: UserService,
  ) {}

  @OnEvent('user.signup')
  async handleUserSignupEvent(user: UserSignupEvent) {
    const request: CreateAccountRequest = {
      name: '현금지갑',
      accountType: '계좌',
      initialBalance: 0,
      currentBalance: 0,
      bankId: 'd6c2a8f3-8b7c-4e0a-9d1b-3c5f7e9a0d2f',
      accountNumber: null,
    };
    try {
      await this.createAccount(request, user.id);
    } catch (error) {
      throw new ApiException(ErrorCode.CREATE_ACCOUNT_FAILED);
    }
  }

  async createAccount(
    request: CreateAccountRequest,
    userId: string,
  ): Promise<AccountResponse> {
    await this.userService.findById(userId);
    const response: AccountResponse = await this.accountRepository.save(
      request,
      userId,
    );
    return response;
  }
}
