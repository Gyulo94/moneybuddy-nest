import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { ApiException } from 'src/global/exception/api.exception';
import { Payload } from 'src/global/types/payload';
import { ImageService } from 'src/image/service/image.service';
import { RedisService } from 'src/redis/service/redis.service';
import { UserRequest } from 'src/user/request/user.request';
import { UserResponse } from 'src/user/response/user.response';
import { UserService } from 'src/user/service/user.service';
import { AuthRequest } from '../request/auth.request';
import { AuthResponse } from '../response/auth.response';
import { TokenResponse } from '../response/token.response';

const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.JWT_SECRET_KEY_EXPIRES_IN);
const REFRESH_TOKEN_EXPIRES_IN = parseInt(
  process.env.JWT_REFRESH_TOKEN_KEY_EXPIRES_IN,
);
const EXPIRE_TIME = ACCESS_TOKEN_EXPIRES_IN * 1000;
@Injectable()
export class AuthService {
  private readonly LOGGER = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly imageService: ImageService,
  ) {}

  async login(request: AuthRequest): Promise<AuthResponse> {
    this.LOGGER.log(
      `--------------------로그인 서비스 실행-------------------`,
    );

    this.LOGGER.log(`1. 유저 검증 진행`);
    const user: UserResponse = await this.vailidateUser(request);
    this.LOGGER.log(`2. 유저 검증 완료`);
    const payload = {
      id: user.id,
    };
    const serverTokens: TokenResponse = await this.generateTokens(payload);
    this.LOGGER.log(`3. JWT 토큰 생성 완료`);

    const response: AuthResponse = AuthResponse.fromModel(user, serverTokens);
    this.LOGGER.log(
      `--------------------로그인 서비스 종료-------------------`,
    );
    return response;
  }

  async refreshToken(user: Payload) {
    this.LOGGER.log(
      `--------------------토큰 재발급 서비스 실행--------------------`,
    );
    this.LOGGER.log(`1. 토큰 재발급 진행`);
    const payload = {
      id: user.id,
    };
    const newTokens = await this.generateTokens(payload);
    this.LOGGER.log(`2. 새로운 토큰 생성 완료`);
    this.LOGGER.log(
      `--------------------토큰 재발급 서비스 종료--------------------`,
    );
    return newTokens;
  }

  private async generateTokens(payload: Payload) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        secret: process.env.JWT_SECRET_KEY,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        secret: process.env.JWT_REFRESH_TOKEN_KEY,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  private async vailidateUser(dto: AuthRequest): Promise<UserResponse> {
    this.LOGGER.log(`2. 이메일로 유저 조회`);
    const user: User = await this.userService.findByEmail(dto.email);
    this.LOGGER.log(
      `3. 유저가 존재하는가? ${user ? '존재함' : '존재하지 않음'}`,
    );
    if (!user) {
      this.LOGGER.error(`유저가 존재하지 않으므로 예외 발생`);
      throw new ApiException(ErrorCode.USER_NOT_FOUND);
    }
    if (user && (await compareSync(dto.password, user.password))) {
      this.LOGGER.log(`4. 비밀번호 일치함`);
      const { password, ...rest } = user;
      return rest;
    } else {
      this.LOGGER.error(`비밀번호가 일치하지 않으므로 예외 발생`);
      throw new ApiException(ErrorCode.INCORRECT_EMAIL_OR_PASSWORD);
    }
  }

  async verifyToken(token: string): Promise<string> {
    this.LOGGER.log(
      `--------------------이메일 토큰 검증 서비스 실행--------------------`,
    );
    const value = await this.redis.get(token);
    this.LOGGER.log(
      `1. 토큰이 존재하는가? ${value ? '존재함' : '존재하지 않음'}`,
    );
    if (value) {
      const email = value.split(':')[2];
      this.LOGGER.log(`2. 이메일 토큰 검증 완료, 이메일: ${email}`);
      this.LOGGER.log(
        `--------------------이메일 토큰 검증 서비스 종료--------------------`,
      );
      return email;
    } else {
      this.LOGGER.error(`토큰이 존재하지 않으므로 예외 발생`);
      throw new ApiException(ErrorCode.VERIFICATION_EMAIL_TOKEN_FAILED);
    }
  }

  async socialLogin(request: UserRequest): Promise<AuthResponse> {
    const { email } = request;
    this.LOGGER.log(
      `--------------------소셜 로그인(가입/로그인) 서비스 실행-------------------`,
    );

    let user: UserResponse;
    let response: AuthResponse;

    const existingUser: User = await this.userService.findByEmail(email);
    this.LOGGER.log(
      `1. 유저가 존재하는가 ?: ${existingUser ? '존재하므로 로그인으로 이동' : '존재하지 않으므로 회원가입으로 이동'}`,
    );

    if (!existingUser) {
      this.LOGGER.log(`2. 소셜 로그인 유저 회원가입 진행`);
      user = await this.userService.signup(request);
      const payload = {
        id: user.id,
      };
      const serverTokens = await this.generateTokens(payload);
      response = AuthResponse.fromModel(user, serverTokens);
      return response;
    } else {
      user = UserResponse.fromModel(existingUser);

      const payload = {
        id: user.id,
      };
      this.LOGGER.log(`3. 소셜 로그인 JWT 토큰 생성`);
      const serverTokens = await this.generateTokens(payload);

      response = AuthResponse.fromModel(user, serverTokens);
      this.LOGGER.log(
        `--------------------소셜 로그인(가입/로그인) 서비스 종료-------------------`,
      );
      return response;
    }
  }
}
