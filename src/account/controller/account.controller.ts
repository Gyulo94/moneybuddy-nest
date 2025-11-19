import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
  private readonly LOGGER = new Logger(AccountController.name);
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @Message(ResponseMessage.CREATE_ACCOUNT_SUCCESS)
  async createAccount(
    @Body() request: AccountRequest,
    @CurrentUser() user: Payload,
  ): Promise<AccountResponse> {
    this.LOGGER.log(
      `--------------------계좌 생성 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`계좌 생성 요청 받음`);
    const response: AccountResponse = await this.accountService.createAccount(
      request,
      user.id,
    );
    this.LOGGER.log(`계좌 생성 완료`);
    this.LOGGER.log(
      `--------------------계좌 생성 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Get('all')
  async findAccountsByUserId(
    @CurrentUser() user: Payload,
  ): Promise<AccountResponse[]> {
    this.LOGGER.log(
      `--------------------계좌 조회 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`계좌 조회 요청 받음`);
    const response: AccountResponse[] =
      await this.accountService.findAccountsByUserId(user.id);
    this.LOGGER.log(`계좌 조회 완료`);
    this.LOGGER.log(
      `--------------------계좌 조회 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Get(':id')
  async findAccountById(@Param('id') id: string): Promise<AccountResponse> {
    this.LOGGER.log(
      `--------------------계좌 상세 조회 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`계좌 상세 조회 요청 받음`);
    const response: AccountResponse = await this.accountService.findById(id);
    this.LOGGER.log(`계좌 상세 조회 완료`);
    this.LOGGER.log(
      `--------------------계좌 상세 조회 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Message(ResponseMessage.UPDATE_ACCOUNT_SUCCESS)
  @Put('update/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body() request: AccountRequest,
    @CurrentUser() user: Payload,
  ): Promise<AccountResponse> {
    this.LOGGER.log(
      `--------------------계좌 수정 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`계좌 수정 요청 받음`);
    const response: AccountResponse = await this.accountService.updateAccount(
      request,
      id,
      user.id,
    );
    this.LOGGER.log(`계좌 수정 완료`);
    this.LOGGER.log(
      `--------------------계좌 수정 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Delete('delete/:id')
  @Message(ResponseMessage.DELETE_ACCOUNT_SUCCESS)
  async deleteAccount(@Param('id') id: string): Promise<void> {
    this.LOGGER.log(
      `--------------------계좌 삭제 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`계좌 삭제 요청 받음`);
    await this.accountService.deleteAccount(id);
    this.LOGGER.log(`계좌 삭제 완료`);
    this.LOGGER.log(
      `--------------------계좌 삭제 컨트롤러 종료--------------------`,
    );
  }
}
