import { Module } from '@nestjs/common';
import { PaymentMethodController } from './controller/payment-method.controller';
import { PaymentMethodRepository } from './repository/payment-method.repository';
import { PaymentMethodService } from './service/payment-method.service';

@Module({
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, PaymentMethodRepository],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
