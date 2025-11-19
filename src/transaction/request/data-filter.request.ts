import { IsOptional, IsString } from 'class-validator';

export class DataFilterRequest {
  @IsOptional()
  @IsString()
  currentDate?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
