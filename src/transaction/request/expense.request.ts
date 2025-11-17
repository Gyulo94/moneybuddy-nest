import { MethodType, Prisma, Tag, TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { FromStringToDateTime } from 'src/global/utils/date-time.utils';
import { TagRequest } from 'src/tag/request/tag.request';

export class ExpenseRequest {
  @IsString()
  @IsOptional()
  accountId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  categoryId: string;

  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  memo?: string;

  @IsEnum(MethodType)
  method: MethodType;

  @IsString()
  @IsOptional()
  paymentMethodId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TagRequest)
  tags?: TagRequest[];

  @IsString()
  time: string;

  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsString()
  @IsOptional()
  subCategoryId?: string;

  public toModel(
    newTags: Tag[],
    userId?: string,
  ): Prisma.TransactionCreateInput {
    return {
      Account: { connect: { id: this.accountId } },
      amount: this.amount,
      transactionAt: FromStringToDateTime(this.date, this.time),
      description: this.description,
      memo: this.memo,
      method: this.method,
      PaymentMethod: this.paymentMethodId
        ? { connect: { id: this.paymentMethodId } }
        : undefined,
      type: TransactionType.EXPENSE,
      Category: { connect: { id: this.categoryId } },
      tags: { connect: newTags.map((tag) => ({ id: tag.id })) },
      SubCategory: this.subCategoryId
        ? { connect: { id: this.subCategoryId } }
        : undefined,
      User: userId ? { connect: { id: userId } } : undefined,
    };
  }
}
