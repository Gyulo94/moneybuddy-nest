import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { OauthLoginDto } from './dto/kakao-auth.dto';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    console.log(user);

    const payload = {
      email: user.email,
      role: user.role,
      sub: {
        name: user.name,
      },
    };
    return {
      user,
      serverTokens: {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '20s',
          secret: process.env.JWT_SECRET_KEY,
        }),
        refresh_token: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN_KEY,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async kakaoLogin(dto: OauthLoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      const newUser = await this.prisma.user.create({
        data: {
          id: String(dto.id),
          email: dto.email,
          name: dto.name,
          image: dto.image,
          password: '',
          isEmailVerified: true,
          kakao: new Date(),
        },
      });

      const payload = {
        email: newUser.email,
        role: newUser.role,
        sub: {
          name: newUser.name,
        },
      };

      return {
        user: newUser,
        serverTokens: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: '20s',
            secret: process.env.JWT_SECRET_KEY,
          }),
          refresh_token: await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
          }),
          expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        },
      };
    } else {
      const payload = {
        email: user.email,
        role: user.role,
        sub: {
          name: user.name,
        },
      };
      return {
        user,
        serverTokens: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: '20s',
            secret: process.env.JWT_SECRET_KEY,
          }),
          refresh_token: await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
          }),
          expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        },
      };
    }
  }

  async googleLogin(dto: OauthLoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      const newUser = await this.prisma.user.create({
        data: {
          id: String(dto.id),
          email: dto.email,
          name: dto.name,
          image: dto.image,
          password: '',
          isEmailVerified: true,
          google: new Date(),
        },
      });

      const payload = {
        email: newUser.email,
        role: newUser.role,
        sub: {
          name: newUser.name,
        },
      };

      return {
        user: newUser,
        serverTokens: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: '20s',
            secret: process.env.JWT_SECRET_KEY,
          }),
          refresh_token: await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
          }),
          expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        },
      };
    } else {
      const payload = {
        email: user.email,
        role: user.role,
        sub: {
          name: user.name,
        },
      };
      return {
        user,
        serverTokens: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: '20s',
            secret: process.env.JWT_SECRET_KEY,
          }),
          refresh_token: await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_TOKEN_KEY,
          }),
          expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        },
      };
    }
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (user && (await compare(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      role: user.role,
      sub: user.sub,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '20s',
        secret: process.env.JWT_SECRET_KEY,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN_KEY,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        verifyToken: token,
      },
    });

    if (!user) {
      throw new ConflictException('유효하지 않은 토큰입니다.');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
        verifyToken: null,
      },
    });
    return { status: 'success', message: '이메일 인증이 완료되었습니다.' };
  }

  async checkOauthAccount(
    email: string,
  ): Promise<{ isOauth: string; oauthDate?: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.kakao) {
      const date = format(user.kakao, 'yyyy년 M월 d일');
      return { isOauth: 'kakao', oauthDate: date };
    }

    if (user && user.google) {
      const date = format(user.google, 'yyyy년 M월 d일');
      return { isOauth: 'google', oauthDate: date };
    }
  }
}
