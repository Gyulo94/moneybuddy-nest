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
import { Payload } from 'src/global/types';
import { PaymentMethodRequest } from '../request/payment-method.request';
import { PaymentMethodResponse } from '../response/payment-method.response';
import { PaymentMethodService } from '../service/payment-method.service';

@Controller('payment-method')
export class PaymentMethodController {
  private readonly LOGGER = new Logger(PaymentMethodController.name);
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post('create')
  @Message(ResponseMessage.CREATE_PAYMENT_METHOD_SUCCESS)
  async createPaymentMethod(
    @Body() request: PaymentMethodRequest,
    @CurrentUser() user: Payload,
  ): Promise<PaymentMethodResponse> {
    this.LOGGER.log(
      `--------------------결제수단 생성 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`결제 수단 생성 요청 받음`);
    const response: PaymentMethodResponse =
      await this.paymentMethodService.createPaymentMethod(request, user.id);
    this.LOGGER.log(`결제 수단 생성 완료`);
    this.LOGGER.log(
      `--------------------결제수단 생성 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Get('all')
  async findPaymentMethodsByUserId(
    @CurrentUser() user: Payload,
  ): Promise<PaymentMethodResponse[]> {
    this.LOGGER.log(
      `--------------------결제수단 조회 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`결제 수단 조회 요청 받음`);
    const response: PaymentMethodResponse[] =
      await this.paymentMethodService.findAllByUserId(user.id);
    this.LOGGER.log(`결제 수단 조회 완료`);
    this.LOGGER.log(
      `--------------------결제수단 조회 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Get(':id')
  async findPaymentMethodById(
    @Param('id') id: string,
  ): Promise<PaymentMethodResponse> {
    this.LOGGER.log(
      `--------------------결제수단 조회 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`결제 수단 조회 요청 받음`);
    const response: PaymentMethodResponse =
      await this.paymentMethodService.findById(id);
    this.LOGGER.log(`결제 수단 조회 완료`);
    this.LOGGER.log(
      `--------------------결제수단 조회 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Put('update/:id')
  @Message(ResponseMessage.UPDATE_PAYMENT_METHOD_SUCCESS)
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() request: PaymentMethodRequest,
  ): Promise<PaymentMethodResponse> {
    this.LOGGER.log(
      `--------------------결제수단 수정 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`결제 수단 수정 요청 받음`);
    const response: PaymentMethodResponse =
      await this.paymentMethodService.updatePaymentMethod(id, request);
    this.LOGGER.log(`결제 수단 수정 완료`);
    this.LOGGER.log(
      `--------------------결제수단 수정 컨트롤러 종료--------------------`,
    );
    return response;
  }

  @Delete('delete/:id')
  @Message(ResponseMessage.DELETE_PAYMENT_METHOD_SUCCESS)
  async deletePaymentMethod(@Param('id') id: string): Promise<void> {
    this.LOGGER.log(
      `--------------------결제수단 삭제 컨트롤러 실행--------------------`,
    );
    this.LOGGER.log(`결제 수단 삭제 요청 받음`);
    await this.paymentMethodService.deletePaymentMethod(id);
    this.LOGGER.log(`결제 수단 삭제 완료`);
    this.LOGGER.log(
      `--------------------결제수단 삭제 컨트롤러 종료--------------------`,
    );
  }
}
