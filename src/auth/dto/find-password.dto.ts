import { IsNotEmpty, IsString } from 'class-validator';

export class FindPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
