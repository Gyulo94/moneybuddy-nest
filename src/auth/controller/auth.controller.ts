import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { Message } from 'src/global/decorator/message.decorator';
import { isPublic } from 'src/global/decorator/public.decorator';
import { ResponseMessage } from 'src/global/enum/response-message.enum';
import { Payload } from 'src/global/types/payload';
import { CreateUserRequest } from 'src/user/request/create-user.request';
import { UpdateUserRequest } from 'src/user/request/update-user.request';
import { UserResponse } from 'src/user/response/user.response';
import { UserService } from 'src/user/service/user.service';
import { RefreshJwtGuard } from '../guards/refresh.guard';
import { AuthRequest } from '../request/auth.request';
import { AuthResponse } from '../response/auth.response';
import { TokenResponse } from '../response/token.response';
import { AuthService } from '../service/auth.service';

@isPublic()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post('signup')
  @Message(ResponseMessage.SIGNUP_SUCCESS)
  async signup(@Body() request: CreateUserRequest): Promise<UserResponse> {
    const response: UserResponse = await this.userService.signup(request);
    return response;
  }

  @Post('reset-password')
  @Message(ResponseMessage.RESET_PASSWORD_SUCCESS)
  async resetPassword(@Body() request: UpdateUserRequest): Promise<void> {
    return await this.userService.resetPassword(request);
  }

  @Post('login')
  @Message(ResponseMessage.LOGIN_SUCCESS)
  async login(@Body() request: AuthRequest): Promise<AuthResponse> {
    const response: AuthResponse = await this.authService.login(request);
    return response;
  }

  @Get('verify-token')
  async verifyToken(@Query('token') token: string): Promise<{ email: string }> {
    const response = await this.authService.verifyToken(token);
    return response;
  }

  @Post('send-signup-email')
  @Message(ResponseMessage.SEND_EMAIL_SUCCESS)
  async sendSignupEmail(@Body('email') email: string): Promise<void> {
    return await this.emailService.sendVerificationMail(email, 'signup');
  }

  @Post('send-reset-password-email')
  @Message(ResponseMessage.SEND_EMAIL_SUCCESS)
  async sendResetPasswordEmail(@Body('email') email: string): Promise<void> {
    return await this.emailService.sendVerificationMail(email, 'reset');
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@CurrentUser() user: Payload): Promise<TokenResponse> {
    const response: TokenResponse = await this.authService.refreshToken(user);
    return response;
  }

  @Post('social-login')
  @Message(ResponseMessage.LOGIN_SUCCESS)
  async socialLogin(@Body() request: CreateUserRequest): Promise<AuthResponse> {
    const response: AuthResponse = await this.authService.socialLogin(request);
    return response;
  }
}
