import { IsEmail, IsString } from 'class-validator';

export class AuthRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
