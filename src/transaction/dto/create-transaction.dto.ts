import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsDate()
  date: Date;

  @IsString()
  time: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  subCategoryId?: string;

  @IsString()
  type: 'INCOME' | 'EXPENSE';

  @IsArray()
  @Type(() => String)
  tags: string[];

  @IsString()
  memo: string;
}
