import { BankResponse } from 'src/bank/response/bank.response';

export class AccountResponse {
  id: string;
  name: string;
  accountType: string;
  initialBalance: number;
  currentBalance: number;
  bank?: BankResponse;
  accountNumber: string;
}
