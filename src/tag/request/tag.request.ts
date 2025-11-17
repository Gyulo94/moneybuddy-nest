import { Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

export class TagRequest {
  @IsString()
  name: string;

  @IsString()
  textColor: string;

  @IsString()
  bgColor: string;

  public toModel(userId: string): Prisma.TagCreateManyInput {
    return {
      name: this.name,
      textColor: this.textColor,
      bgColor: this.bgColor,
      userId,
    };
  }
}
