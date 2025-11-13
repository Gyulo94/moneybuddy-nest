import { Controller } from '@nestjs/common';
import { isPublic } from 'src/global/decorator/public.decorator';
import { ImageService } from '../service/image.service';

@isPublic()
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
}
