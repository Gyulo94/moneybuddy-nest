import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateTagDto) {
    const { userId, name } = dto;
    return this.prisma.tag.create({
      data: {
        name,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.tag.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });
    if (!tag) {
      throw new NotFoundException();
    }
    return tag;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tag.delete({
      where: {
        id,
      },
    });
  }
}
