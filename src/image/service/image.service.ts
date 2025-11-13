import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EntityType, Image } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { ImageRepository } from '../repository/image.repository';
import { DeleteImageRequest } from '../request/delete-image.request';
import { ImageRequest } from '../request/image.request';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly httpSerivce: HttpService,
  ) {}
  private FILE_URL = process.env.FILE_URL;

  async createImages(request: ImageRequest): Promise<string[]> {
    const { id, images, entity } = request;

    const requestObj = {
      id,
      images,
      existingImages: [],
      entity: entity.toString().toLowerCase(),
    };

    try {
      const response = await firstValueFrom(
        this.httpSerivce.post<string[]>(
          `${this.FILE_URL}/moneybuddy/create`,
          requestObj,
        ),
      );

      const imagesObj = {
        entityId: id,
        urls: response.data,
        entityType: entity,
      };

      await this.imageRepository.saveAll(imagesObj);
      const savedUrls = await this.findByEntityIdAndEntityType(id, entity);
      return savedUrls;
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async updateImages(request: ImageRequest): Promise<string[]> {
    const { id, images, existingImages, entity } = request;

    const requestObj = {
      id,
      images,
      existingImages,
      entity: entity.toString().toLowerCase(),
    };

    try {
      const response = await firstValueFrom(
        this.httpSerivce.put<string[]>(
          `${this.FILE_URL}/moneybuddy/update`,
          requestObj,
        ),
      );

      if (existingImages && existingImages.length > 0) {
        await this.imageRepository.deleteMany(id);
      }

      const imagesObj = {
        entityId: id,
        urls: response.data,
        entityType: entity,
      };
      await this.imageRepository.saveAll(imagesObj);
      const savedUrls = await this.findByEntityIdAndEntityType(id, entity);
      return savedUrls;
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async deleteImages({ id, entity }: DeleteImageRequest): Promise<boolean> {
    const requestObj = {
      id,
      serviceName: 'moneybuddy',
      entity: entity.toString().toLowerCase(),
    };

    try {
      const response = await firstValueFrom(
        this.httpSerivce.delete<boolean>(`${this.FILE_URL}/moneybuddy/delete`, {
          data: requestObj,
        }),
      );

      await this.imageRepository.deleteMany(id);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async findByEntityIdAndEntityType(
    entityId: string,
    entityType: EntityType,
  ): Promise<string[]> {
    const images: Image[] =
      await this.imageRepository.findByEntityIdAndEntityType(
        entityId,
        entityType,
      );
    const urls = images.map((image) => image.url);
    return urls ? urls : [];
  }
}
