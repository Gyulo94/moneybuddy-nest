import { Injectable } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllByUserId(userId: string): Promise<Tag[]> {
    const tags = await this.prismaService.tag.findMany({
      where: { userId },
    });
    return tags;
  }

  async saveAll(
    data: Prisma.TagCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    const createdTags = await this.prismaService.tag.createMany({
      data,
      skipDuplicates: true,
    });
    return createdTags;
  }
}
