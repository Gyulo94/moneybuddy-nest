import { Bank } from '@prisma/client';

export class BankResponse {
  id: string;
  name: string;
  logo: string;

  static fromModel(bank: Bank): BankResponse {
    const { id, name, logo } = bank;
    return {
      id,
      name,
      logo,
    } as BankResponse;
  }
}
