import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityType, User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { ApiException } from 'src/global/exception/api.exception';
import { Payload } from 'src/global/types/payload';
import { ImageService } from 'src/image/service/image.service';
import { RedisService } from 'src/redis/service/redis.service';
import { CreateUserRequest } from 'src/user/request/create-user.request';
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
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly imageService: ImageService,
  ) {}

  async login(request: AuthRequest): Promise<AuthResponse> {
    const user = await this.vailidateUser(request);
    const image = await this.imageService
      .findByEntityIdAndEntityType(user.id, EntityType.USER)
      .then((urls) => urls[0] || null);
    const payload = {
      id: user.id,
    };
    const serverTokens: TokenResponse = await this.generateTokens(payload);
    return {
      user: {
        ...user,
        image: image || null,
      },
      serverTokens,
    };
  }

  async refreshToken(user: Payload) {
    const payload = {
      id: user.id,
    };
    const newTokens = await this.generateTokens(payload);
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

  private async vailidateUser(
    dto: AuthRequest,
  ): Promise<Omit<User, 'password'>> {
    const user: User = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new ApiException(ErrorCode.USER_NOT_FOUND);
    }
    if (user && (await compareSync(dto.password, user.password))) {
      const { password, ...rest } = user;
      return rest;
    } else {
      throw new ApiException(ErrorCode.INCORRECT_EMAIL_OR_PASSWORD);
    }
  }

  async verifyToken(token: string): Promise<{ email: string }> {
    const value = await this.redis.get(token);
    if (value) {
      const email = value.split(':')[2];
      return { email };
    } else {
      throw new ApiException(ErrorCode.VERIFICATION_EMAIL_TOKEN_FAILED);
    }
  }

  async socialLogin(request: CreateUserRequest): Promise<AuthResponse> {
    const { email } = request;

    let user: UserResponse;

    const existingUser: User = await this.userService.findByEmail(email);

    if (!existingUser) {
      user = await this.userService.signup(request);
    } else {
      const image = await this.imageService
        .findByEntityIdAndEntityType(existingUser.id, EntityType.USER)
        .then((urls) => urls[0] || null);
      user = {
        ...existingUser,
        image,
      };
    }

    const payload = {
      id: user.id,
    };

    return {
      user,
      serverTokens: await this.generateTokens(payload),
    };
  }
}
