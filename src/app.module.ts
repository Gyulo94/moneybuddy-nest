import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { BankModule } from './bank/bank.module';
import { GlobalModule } from './global/global.module';
import { RequestMiddleware } from './global/utils/logger.middleware';
import { UserModule } from './user/user.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { TagModule } from './tag/tag.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GlobalModule,
    AuthModule,
    UserModule,
    BankModule,
    AccountModule,
    PaymentMethodModule,
    TagModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
