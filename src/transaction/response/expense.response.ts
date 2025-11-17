import { MethodType, Transaction, TransactionType } from '@prisma/client';
import { AccountResponse } from 'src/account/response/account.response';
import { CategoryResponse } from 'src/category/response/category.response';
import { PaymentMethodResponse } from 'src/payment-method/response/payment-method.response';
import { SubCategoryResponse } from 'src/subCategory/response/sub-category.response';
import { TagResponse } from 'src/tag/controller/response/tag.response';

export class ExpenseResponse {
  id: string;
  amount: number;
  type: TransactionType;
  category?: CategoryResponse;
  subCategory?: SubCategoryResponse;
  method: MethodType;
  description?: string;
  transactionAt: Date;
  account?: AccountResponse;
  paymentMethod?: PaymentMethodResponse;
  memo?: string;
  tags: TagResponse[];

  static fromModel(
    entity: Transaction & {
      Account?: AccountResponse;
      PaymentMethod?: PaymentMethodResponse;
      tags?: TagResponse[];
      Category?: CategoryResponse;
      SubCategory?: SubCategoryResponse;
    },
  ): ExpenseResponse {
    const {
      id,
      amount,
      type,
      method,
      memo,
      description,
      transactionAt,
      Account: account,
      PaymentMethod: paymentMethod,
      tags,
      Category: category,
      SubCategory: subCategory,
    } = entity;
    return {
      id,
      amount,
      type,
      method,
      memo,
      description,
      transactionAt,
      account,
      paymentMethod,
      tags,
      category,
      subCategory,
    } as ExpenseResponse;
  }
}
