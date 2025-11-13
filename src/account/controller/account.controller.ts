import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Message } from 'src/global/decorator/message.decorator';
import { ResponseMessage } from 'src/global/enum/response-message.enum';
import { Payload } from 'src/global/types/payload';
import { CreateAccountRequest } from '../request/create-account.request';
import { AccountResponse } from '../response/account.response';
import { AccountService } from '../service/account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @Message(ResponseMessage.CREATE_ACCOUNT_SUCCESS)
  async createAccount(
    @Body() request: CreateAccountRequest,
    @CurrentUser() user: Payload,
  ): Promise<AccountResponse> {
    const response: AccountResponse = await this.accountService.createAccount(
      request,
      user.id,
    );
    return response;
  }
}
