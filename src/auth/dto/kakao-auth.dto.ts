import { IsEmail, IsNumber, IsString } from 'class-validator';

export class OauthLoginDto {
  @IsNumber()
  id: number;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  image: string;
}
