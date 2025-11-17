import { Tag } from '@prisma/client';

export class TagResponse {
  id: string;
  name: string;
  textColor: string;
  bgColor: string;

  static fromModel(entity: Tag): TagResponse {
    const { id, name, textColor, bgColor } = entity;
    return {
      id,
      name,
      textColor,
      bgColor,
    } as TagResponse;
  }
}
