import { EntityType } from '@prisma/client';

export class DeleteImageRequest {
  id: string;
  entity: EntityType;
}
