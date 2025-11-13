import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: User): Promise<User> {
    const result = await this.prisma.user.create({
      data,
    });
    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });
    return result;
  }

  async findById(id: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });
    return result;
  }
  async update(data: User): Promise<User> {
    const { email } = data;
    const result = await this.prisma.user.update({
      where: {
        email,
      },
      data,
    });
    return result;
  }
}
