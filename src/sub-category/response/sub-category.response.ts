import { SubCategory } from '@prisma/client';

export class SubCategoryResponse {
  id: string;
  name: string;

  static fromModel(entity: SubCategory): SubCategoryResponse {
    const { id, name } = entity;
    return {
      id,
      name,
    } as SubCategoryResponse;
  }
}
