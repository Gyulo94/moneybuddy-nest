import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountRequest {
  @IsString()
  name: string;

  @IsString()
  accountType: string;

  @IsNumber()
  initialBalance: number;

  @IsNumber()
  currentBalance: number;

  @IsString()
  bankId: string;

  @IsString()
  @IsOptional()
  accountNumber: string;
}
