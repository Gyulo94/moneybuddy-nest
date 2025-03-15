import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { format } from 'date-fns';
import { FindPasswordDto } from 'src/auth/dto/find-password.dto';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async emailCheck(email: string) {
    const user = await this.findByEmail(email);
    if (user) {
      if (user?.kakao) {
        const date = format(user.kakao, 'yyyy년 M월 d일');
        console.error(`${date}에 카카오로 가입된 이메일입니다.`);
        return {
          status: 'error',
          message: `${date}에 카카오로 가입된 이메일입니다.`,
        };
      } else if (user?.google) {
        const date = format(user.google, 'yyyy년 M월 d일');
        console.error(`${date}에 구글로 가입된 이메일입니다.`);
        return {
          status: 'error',
          message: `${date}에 구글로 가입된 이메일입니다.`,
        };
      }
      console.error('이미 가입된 이메일입니다.');
      return { status: 'error', message: '이미 가입된 이메일입니다.' };
    }
    return { status: 'success', message: '사용 가능한 이메일입니다.' };
  }

  async create(dto: CreateUserDto) {
    const user = await this.findByEmail(dto.email);

    if (user) {
      console.error('이미 가입된 이메일입니다.');
      return { status: 'error', message: '이미 가입된 이메일입니다.' };
    }

    const verifyToken = uuid.v4();

    await this.prisma.user.create({
      data: {
        ...dto,
        verifyToken,
        password: await hash(dto.password, 10),
      },
    });

    await this.sendVerifyMail(dto.email, verifyToken);

    return { status: 'success', message: '회원가입이 완료되었습니다.' };
  }

  async getProfile(email: string) {
    return await this.findByEmail(email);
  }

  async sendVerifyMail(email: string, token: string) {
    await this.emailService.sendVerificationMail(email, token);
  }

  async findPassword(dto: FindPasswordDto) {
    const { token, password } = dto;
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
        password: await hash(password, 10),
        verifyToken: null,
      },
    });
    return {
      status: 'success',
      message: '비밀번호가 성공적으로 변경되었습니다.',
    };
  }
}
