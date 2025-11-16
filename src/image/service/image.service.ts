import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { ImageRepository } from '../repository/image.repository';
import { ImageRequest } from '../request/image.request';
import { ImageResponse } from '../response/image.response';

@Injectable()
export class ImageService {
  private readonly LOGGER = new Logger(ImageService.name);
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly httpSerivce: HttpService,
  ) {}
  private FILE_URL = process.env.FILE_URL;

  async createUserImage(url: string): Promise<Image> {
    let userImage: Image;
    this.LOGGER.log(
      `--------------------이미지 생성 서비스 실행--------------------`,
    );

    if (
      url &&
      (url.includes('k.kakaocdn.net') ||
        url.includes('lh3.googleusercontent.com'))
    ) {
      this.LOGGER.log(`1. 프로필 이미지 생성 중 (일반계정이면 건너뜀)`);
      userImage = await this.imageRepository.save(url);
      this.LOGGER.log(`2. 프로필 이미지 생성 완료`);
      this.LOGGER.log(
        `--------------------이미지 생성 서비스 종료--------------------`,
      );
      return userImage;
    }
  }

  @Transactional()
  async createImages(request: ImageRequest): Promise<ImageResponse[]> {
    const { id, urls } = request;
    this.LOGGER.log(
      `--------------------이미지 생성 서비스 실행--------------------`,
    );

    this.LOGGER.log(`요청 이미지 URL들: ${urls.join(', ')}`);
    const requestObj = {
      id,
      images: urls,
      existingImages: [],
      entity: 'transaction',
    };

    try {
      this.LOGGER.log(`1. 이미지 생성 요청 전송 중`);
      const res = await firstValueFrom(
        this.httpSerivce.post<string[]>(
          `${this.FILE_URL}/moneybuddy/create`,
          requestObj,
        ),
      );
      this.LOGGER.log(`2. 이미지 생성 요청 완료`);

      this.LOGGER.log(`3. 이미지 생성 결과 처리 중`);
      const imagesObj: Prisma.ImageCreateInput[] = res.data.map((url) => ({
        url,
        transaction: { connect: { id } },
      }));
      await this.imageRepository.saveAll(imagesObj);
      this.LOGGER.log(`4. 이미지들 저장 완료`);
      const images = await this.imageRepository.findAllByModelId(id);
      this.LOGGER.log(`5. 이미지들 조회 완료`);
      const response = images.map((image) => ImageResponse.fromModel(image));

      this.LOGGER.log(
        `--------------------이미지 생성 서비스 종료--------------------`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async updateImages(request: ImageRequest): Promise<ImageResponse[]> {
    const { id, urls, existingImages } = request;
    this.LOGGER.log(
      `--------------------이미지 수정 서비스 실행--------------------`,
    );

    const requestObj = {
      id,
      images: urls,
      existingImages,
      entity: 'transaction',
    };

    try {
      this.LOGGER.log(`1. 이미지 수정 요청 전송 중`);
      const res = await firstValueFrom(
        this.httpSerivce.put<string[]>(
          `${this.FILE_URL}/moneybuddy/update`,
          requestObj,
        ),
      );
      this.LOGGER.log(`2. 이미지 수정 요청 완료`);

      if (existingImages && existingImages.length > 0) {
        this.LOGGER.log(`3. 기존 이미지들 삭제 중`);
        await this.imageRepository.deleteMany(id);
        this.LOGGER.log(`4. 기존 이미지들 삭제 완료`);
      }

      this.LOGGER.log(`5. 수정된 이미지들 저장 중`);
      const imagesObj: Prisma.ImageCreateInput[] = res.data.map((url) => ({
        url,
        transaction: { connect: { id } },
      }));

      await this.imageRepository.saveAll(imagesObj);
      this.LOGGER.log(`6. 수정된 이미지들 저장 완료`);

      this.LOGGER.log(`7. 이미지들 조회 중`);
      const images = await this.imageRepository.findAllByModelId(id);
      const response = images.map((image) => ImageResponse.fromModel(image));
      this.LOGGER.log(`8. 이미지들 변환 완료`);
      this.LOGGER.log(
        `--------------------이미지 수정 서비스 종료--------------------`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  async deleteImages(transactionId: string): Promise<boolean> {
    this.LOGGER.log(
      `--------------------이미지 삭제 서비스 실행--------------------`,
    );
    const requestObj = {
      id: transactionId,
      serviceName: 'moneybuddy',
      entity: 'transaction',
    };

    try {
      this.LOGGER.log(`1. 이미지 삭제 요청 전송 중`);
      const response = await firstValueFrom(
        this.httpSerivce.delete<boolean>(`${this.FILE_URL}/moneybuddy/delete`, {
          data: requestObj,
        }),
      );

      await this.imageRepository.deleteMany(transactionId);

      this.LOGGER.log(`2. 이미지 삭제 요청 완료`);
      this.LOGGER.log(
        `--------------------이미지 삭제 서비스 종료--------------------`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
