import { Transaction } from '@prisma/client';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TransactionDetailResponse } from './transaction-detail.response';

export class TransactionByDateResponse {
  date: string;
  totalAmount: number;
  details: TransactionDetailResponse[];

  static fromModel(
    dateString: string,
    transactions: Transaction[],
  ): TransactionByDateResponse {
    const date = new Date(dateString);
    transactions.sort(
      (a, b) => a.transactionAt.getTime() - b.transactionAt.getTime(),
    );
    return {
      date: format(date, 'MM/dd (EEE)', { locale: ko }),
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      details: transactions.map((transaction) =>
        TransactionDetailResponse.fromModel(transaction),
      ),
    };
  }
}
