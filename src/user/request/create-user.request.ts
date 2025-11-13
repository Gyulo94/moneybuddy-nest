import { Provider } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  provider: Provider;

  @IsString()
  @IsOptional()
  token: string;

  @IsString()
  @IsOptional()
  password: string;
}
