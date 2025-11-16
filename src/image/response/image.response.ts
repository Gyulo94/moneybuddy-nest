import { Image } from '@prisma/client';

export class ImageResponse {
  id: string;
  url: string;

  static fromModel(image: Image): ImageResponse {
    const { id, url, transactionId } = image;
    return {
      id,
      url,
      transactionId: transactionId ? transactionId : null,
    } as ImageResponse;
  }
}
