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

export class IncomeRequest {
  @IsOptional()
  @IsString()
  accountId?: string;

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

  @IsOptional()
  @IsEnum(MethodType)
  method: MethodType;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TagRequest)
  tags?: TagRequest[];

  @IsString()
  time: string;

  @IsEnum(TransactionType)
  type?: TransactionType;

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
      method: this.method ?? MethodType.ACCOUNT,
      type: TransactionType.INCOME,
      Category: { connect: { id: this.categoryId } },
      tags: { connect: newTags.map((tag) => ({ id: tag.id })) },
      User: userId ? { connect: { id: userId } } : undefined,
    };
  }
}
