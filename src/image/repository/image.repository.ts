import { Injectable } from '@nestjs/common';
import { EntityType, Image } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

interface SaveImage {
  entityId: string;
  urls: string[];
  entityType: EntityType;
}

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveAll(data: SaveImage): Promise<{ count: number }> {
    const { entityId, urls, entityType } = data;
    const result = await this.prisma.image.createMany({
      data: urls.map((url) => ({
        url,
        entityId,
        entityType,
      })),
    });
    return result;
  }

  async deleteMany(id: string): Promise<{ count: number }> {
    const result = await this.prisma.image.deleteMany({
      where: {
        entityId: id,
      },
    });
    return result;
  }

  async findByEntityIdAndEntityType(
    entityId: string,
    entityType: EntityType,
  ): Promise<Image[]> {
    const result = await this.prisma.image.findMany({
      where: {
        entityId,
        entityType,
      },
    });
    return result;
  }
}
