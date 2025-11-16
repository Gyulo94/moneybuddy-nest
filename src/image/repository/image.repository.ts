import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(url: string): Promise<Image> {
    const result = await this.prisma.image.create({
      data: {
        url,
      },
    });
    return result;
  }

  async saveAll(data: Prisma.ImageCreateInput[]): Promise<Prisma.BatchPayload> {
    const result = await this.prisma.image.createMany({
      data,
    });
    return result;
  }

  findAllByModelId(id: string): Promise<Image[]> {
    return this.prisma.image.findMany({
      where: {
        transactionId: id,
      },
    });
  }

  async deleteMany(id: string): Promise<Prisma.BatchPayload> {
    const result = await this.prisma.image.deleteMany({
      where: {
        transactionId: id,
      },
    });
    return result;
  }

  // async findByEntityIdAndEntityType(
  //   entityId: string,
  //   entityType: EntityType,
  // ): Promise<Image[]> {
  //   const result = await this.prisma.image.findMany({
  //     where: {
  //       entityId,
  //       entityType,
  //     },
  //   });
  //   return result;
  // }
}
