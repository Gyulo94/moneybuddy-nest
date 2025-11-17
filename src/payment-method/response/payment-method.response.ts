import { MethodType, PaymentMethod } from '@prisma/client';
import { AccountResponse } from 'src/account/response/account.response';
import { IssuerResponse } from 'src/issuer/response/Issuer.response';
import { UserResponse } from 'src/user/response/user.response';

export class PaymentMethodResponse {
  id: string;
  name: string;
  methodType: MethodType;
  issuer?: IssuerResponse;
  account?: AccountResponse;
  user?: UserResponse;
  cardNumber: string;

  static fromModel(
    entity: PaymentMethod & {
      Issuer?: IssuerResponse;
      Account?: AccountResponse;
      User?: UserResponse;
    },
  ): PaymentMethodResponse {
    const {
      id,
      name,
      methodType,
      cardNumber,
      Issuer: issuer,
      Account: account,
      User: user,
    } = entity;
    return {
      id,
      name,
      methodType,
      cardNumber,
      issuer,
      account,
      user,
    } as PaymentMethodResponse;
  }
}
