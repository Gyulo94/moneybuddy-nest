import { IsEmail, IsString } from 'class-validator';

export class EmailVerificationDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
