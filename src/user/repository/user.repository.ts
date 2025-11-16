import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  update(arg0: Prisma.UserCreateInput) {
    throw new Error('Method not implemented.');
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const newUser = await this.prisma.user.create({
      data,
      include: {
        image: true,
      },
    });
    return newUser;
  }

  // 이메일로 유저 조회
  async findByEmail(email: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      include: {
        image: true,
      },
    });
    return result;
  }

  async findById(id: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: { id },
      include: {
        image: true,
      },
    });
    return user;
  }
}
