import { Category } from '@prisma/client';

export class CategoryResponse {
  id: string;
  name: string;
  icon: string;
  color: string;

  static fromModel(entity: Category): CategoryResponse {
    const { id, name, icon, color } = entity;
    return {
      id,
      name,
      icon,
      color,
    } as CategoryResponse;
  }
}
