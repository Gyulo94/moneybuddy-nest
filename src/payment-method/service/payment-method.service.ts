import { Injectable, Logger } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import { PaymentMethodRepository } from '../repository/payment-method.repository';
import { PaymentMethodRequest } from '../request/payment-method.request';
import { PaymentMethodResponse } from '../response/payment-method.response';

@Injectable()
export class PaymentMethodService {
  private readonly LOGGER = new Logger(PaymentMethodService.name);
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async createPaymentMethod(
    request: PaymentMethodRequest,
    userId: string,
  ): Promise<PaymentMethodResponse> {
    this.LOGGER.log(
      `--------------------결제수단 생성 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 결제수단 생성 진행`);
    const newPaymentMethodModel: PaymentMethod =
      await this.paymentMethodRepository.create(request.toModel(userId));
    const response: PaymentMethodResponse = PaymentMethodResponse.fromModel(
      newPaymentMethodModel,
    );
    this.LOGGER.log(`2. 결제수단 생성 완료`);
    this.LOGGER.log(
      `--------------------결제수단 생성 서비스 종료--------------------`,
    );
    return response;
  }

  async findAllByUserId(id: string): Promise<PaymentMethodResponse[]> {
    this.LOGGER.log(
      `--------------------결제수단 조회 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 결제수단 조회 진행`);
    const paymentMethods: PaymentMethod[] =
      await this.paymentMethodRepository.findAllByUserId(id);
    const response = paymentMethods.map((method) =>
      PaymentMethodResponse.fromModel(method),
    );
    this.LOGGER.log(`2. 결제수단 조회 완료`);
    this.LOGGER.log(
      `--------------------결제수단 조회 서비스 종료--------------------`,
    );
    return response;
  }

  async findById(id: string): Promise<PaymentMethodResponse> {
    this.LOGGER.log(
      `--------------------결제수단 조회 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 결제수단 조회 진행`);
    const paymentMethod: PaymentMethod =
      await this.paymentMethodRepository.findById(id);
    const response: PaymentMethodResponse =
      PaymentMethodResponse.fromModel(paymentMethod);
    this.LOGGER.log(`2. 결제수단 조회 완료`);
    this.LOGGER.log(
      `--------------------결제수단 조회 서비스 종료--------------------`,
    );
    return response;
  }

  async updatePaymentMethod(
    id: string,
    request: PaymentMethodRequest,
  ): Promise<PaymentMethodResponse> {
    this.LOGGER.log(
      `--------------------결제수단 수정 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 결제수단 존재 확인 중`);
    await this.findById(id);
    this.LOGGER.log(`2. 결제수단 존재 확인 완료`);
    this.LOGGER.log(`3. 결제수단 수정 진행 중`);
    const updatedPaymentMethodModel: PaymentMethod =
      await this.paymentMethodRepository.update(id, request.toModel());
    const response: PaymentMethodResponse = PaymentMethodResponse.fromModel(
      updatedPaymentMethodModel,
    );
    this.LOGGER.log(`4. 결제수단 수정 완료`);
    this.LOGGER.log(
      `--------------------결제수단 수정 서비스 종료--------------------`,
    );
    return response;
  }

  async deletePaymentMethod(id: string) {
    this.LOGGER.log(
      `--------------------결제수단 삭제 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 결제수단 존재 확인 중`);
    await this.findById(id);
    this.LOGGER.log(`2. 결제수단 존재 확인 완료`);
    this.LOGGER.log(`3. 결제수단 삭제 진행 중`);
    await this.paymentMethodRepository.delete(id);
    this.LOGGER.log(`4. 결제수단 삭제 완료`);
    this.LOGGER.log(
      `--------------------결제수단 삭제 서비스 종료--------------------`,
    );
  }
}
