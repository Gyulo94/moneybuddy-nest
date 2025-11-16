import { Body, Controller, Get, Post } from '@nestjs/common';
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

  // @Put('update/:id')
  // async updateAccount(
  //   @Param('id') id: string,
  //   @Body() request: AccountRequest,
  // ): Promise<AccountResponse> {
  //   const response: AccountResponse = await this.accountService.updateAccount(
  //     request,
  //     id,
  //   );
  //   return response;
  // }
}

/**
 * 계좌 수정
 *
 * @param AccountRequest (String name, String bankName, String accountNumber,
 *                       AccountType accountType, int initialBalance, String
 *                       logo)
 * @param UUID           (UUID id)
 * @return AccountResponse (UUID id, String name, String bankName, String
 *         accountNumber, AccountType accountType, int currentBalance, int
 *         initialBalance,
 *         LocalDateTime createdAt, LocalDateTime updatedAt, User user)
 */
// @PutMapping("update/{id}")
// public Api<AccountResponse> updateAccount(@Valid @RequestBody AccountRequest request, @PathVariable("id") UUID id) {
//   AccountResponse account = accountService.updateAccount(request, id);
//   return Api.OK(account, ResponseMessage.UPDATE_ACCOUNT_SUCCESS);
// }

/**
 * 계좌 삭제
 *
 * @param UUID (UUID id)
 * @return String (String message)
 *         - message: "계좌가 성공적으로 삭제되었습니다."
 */
//   @DeleteMapping("delete/{id}")
//   public Api<String> deleteAccount(@PathVariable("id") UUID id) {
//     accountService.deleteAccount(id);
//     return Api.OK(ResponseMessage.DELETE_ACCOUNT_SUCCESS);
//   }
// }
