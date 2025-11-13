import { EntityType } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class ImageRequest {
  @IsString()
  id: string;

  @IsArray()
  images: string[];

  @IsArray()
  @IsOptional()
  existingImages: string[] = [];

  @IsEnum(EntityType)
  entity: EntityType;
}
