import { MethodType, Transaction, TransactionType } from '@prisma/client';
import { AccountResponse } from 'src/account/response/account.response';
import { CategoryResponse } from 'src/category/response/category.response';
import { PaymentMethodResponse } from 'src/payment-method/response/payment-method.response';
import { TagResponse } from 'src/tag/controller/response/tag.response';

export class IncomeResponse {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryResponse;
  method: MethodType;
  description?: string;
  account: AccountResponse;
  paymentMethod: PaymentMethodResponse;
  transactionAt: Date;
  memo?: string;
  tags: TagResponse[];

  static fromModel(
    entity: Transaction & {
      Account: AccountResponse;
      PaymentMethod: PaymentMethodResponse;
      Tags: TagResponse[];
      Category: CategoryResponse;
    },
  ): IncomeResponse {
    const {
      id,
      amount,
      type,
      method,
      description,
      transactionAt,
      memo,
      Account: account,
      PaymentMethod: paymentMethod,
      Tags: tags,
      Category: category,
    } = entity;
    return {
      id,
      amount,
      type,
      category,
      method,
      description,
      account,
      paymentMethod,
      transactionAt,
      memo,
      tags,
    } as IncomeResponse;
  }
}
