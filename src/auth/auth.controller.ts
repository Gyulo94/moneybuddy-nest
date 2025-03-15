import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EmailVerificationDto } from 'src/email/dto/email-verification.dto';
import { EmailService } from 'src/email/email.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { LoginDto } from './dto/auth.dto';
import { FindPasswordDto } from './dto/find-password.dto';
import { OauthLoginDto } from './dto/kakao-auth.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Public()
  @Post('kakao-login')
  async kakaoLogin(@Body() dto: OauthLoginDto) {
    return await this.authService.kakaoLogin(dto);
  }

  @Public()
  @Post('google-login')
  async googleLogin(@Body() dto: OauthLoginDto) {
    return await this.authService.googleLogin(dto);
  }

  @Public()
  @Post('check-oauth')
  async checkOauth(@Body('email') email: string) {
    const oauthInfo = await this.authService.checkOauthAccount(email);
    return { isOauth: oauthInfo.isOauth, oauthDate: oauthInfo.oauthDate };
  }

  @Public()
  @Post('email-check')
  async emailCheck(@Body('email') email: string) {
    return await this.userService.emailCheck(email);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification-email')
  async resendVerifyEmail(@Body() dto: EmailVerificationDto) {
    return await this.emailService.sendVerificationMail(dto.email, dto.token);
  }

  @Public()
  @Post('find-password-mail')
  async findPasswordMail(@Body('email') email: string) {
    return await this.emailService.findPasswordMail(email);
  }

  @Public()
  @Post('find-password')
  async findPassword(@Body() dto: FindPasswordDto) {
    return await this.userService.findPassword(dto);
  }

  @Public()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    return await this.authService.refreshToken(req.user);
  }
}
