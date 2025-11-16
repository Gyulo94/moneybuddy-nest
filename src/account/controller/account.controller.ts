import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Message } from 'src/global/decorator/message.decorator';
import { ResponseMessage } from 'src/global/enum/response-message.enum';
import { Payload } from 'src/global/types/payload';
import { AccountRequest } from '../request/account.request';
import { AccountResponse } from '../response/account.response';
import { AccountService } from '../service/account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @Message(ResponseMessage.CREATE_ACCOUNT_SUCCESS)
  async createAccount(
    @Body() request: AccountRequest,
    @CurrentUser() user: Payload,
  ): Promise<AccountResponse> {
    const response: AccountResponse = await this.accountService.createAccount(
      request,
      user.id,
    );
    return response;
  }

  @Get('all')
  async findAccountsById(
    @CurrentUser() user: Payload,
  ): Promise<AccountResponse[]> {
    const response: AccountResponse[] =
      await this.accountService.findAccountsByUserId(user.id);
    return response;
  }

  @Message(ResponseMessage.UPDATE_ACCOUNT_SUCCESS)
  @Put('update/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body() request: AccountRequest,
    @CurrentUser() user: Payload,
  ): Promise<AccountResponse> {
    const response: AccountResponse = await this.accountService.updateAccount(
      request,
      id,
      user.id,
    );
    return response;
  }

  @Delete('delete/:id')
  @Message(ResponseMessage.DELETE_ACCOUNT_SUCCESS)
  async deleteAccount(@Param('id') id: string): Promise<void> {
    await this.accountService.deleteAccount(id);
  }
}
