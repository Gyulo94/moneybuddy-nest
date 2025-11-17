import { MethodType, Transaction, TransactionType } from '@prisma/client';
import { AccountResponse } from 'src/account/response/account.response';
import { CategoryResponse } from 'src/category/response/category.response';
import { FromDateTimeToString } from 'src/global/utils/date-time.utils';
import { PaymentMethodResponse } from 'src/payment-method/response/payment-method.response';
import { SubCategoryResponse } from 'src/sub-category/response/sub-category.response';
import { TagResponse } from 'src/tag/controller/response/tag.response';

export class TransactionDetailResponse {
  id: string;
  amount: number;
  type: TransactionType;
  method: MethodType;
  memo?: string;
  description?: string;
  transactionAt: Date;
  account?: AccountResponse;
  paymentMethod?: PaymentMethodResponse;
  tags?: TagResponse[];
  time: string;
  date: string;
  category?: CategoryResponse;
  subCategory?: SubCategoryResponse;

  static fromModel(
    entity: Transaction & {
      Category?: CategoryResponse;
      Account?: AccountResponse;
      PaymentMethod?: PaymentMethodResponse;
      SubCategory?: SubCategoryResponse;
      tags?: TagResponse[];
    },
  ): TransactionDetailResponse {
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
    const { dateString: date, timeString: time } =
      FromDateTimeToString(transactionAt);
    return {
      id,
      amount,
      type,
      method,
      memo,
      date,
      time,
      description,
      transactionAt,
      account,
      paymentMethod,
      tags,
      category,
      subCategory,
    } as TransactionDetailResponse;
  }
}
