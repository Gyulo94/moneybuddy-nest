import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        ...dto,
      },
    });
  }

  async findAll() {
    return await this.prisma.tag.findMany();
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

  async update(id: string, dto: UpdateTagDto) {
    await this.findOne(id);
    return this.prisma.tag.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
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
