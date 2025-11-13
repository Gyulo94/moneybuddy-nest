import { Module } from '@nestjs/common';
import { ImageController } from './controller/image.controller';
import { ImageRepository } from './repository/image.repository';
import { ImageService } from './service/image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
