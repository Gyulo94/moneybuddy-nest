import { MethodType, Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PaymentMethodRequest {
  @IsString()
  name: string;

  @IsEnum(MethodType)
  methodType: MethodType;

  @IsString()
  issuerId: string;

  @IsString()
  accountId: string;

  @IsOptional()
  @IsString()
  cardNumber: string;

  public toModel(userId?: string): Prisma.PaymentMethodCreateInput {
    return {
      name: this.name,
      methodType: this.methodType,
      Issuer: { connect: { id: this.issuerId } },
      Account: { connect: { id: this.accountId } },
      User: userId ? { connect: { id: userId } } : undefined,
      cardNumber: this.cardNumber,
    };
  }
}
