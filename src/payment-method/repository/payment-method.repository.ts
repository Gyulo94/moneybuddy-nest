import { Injectable } from '@nestjs/common';
import { PaymentMethod, Prisma } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class PaymentMethodRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PaymentMethodCreateInput): Promise<PaymentMethod> {
    const newPaymentMethod = await this.prisma.paymentMethod.create({
      data,
      include: {
        Issuer: true,
        Account: true,
        User: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return newPaymentMethod;
  }

  async findAllByUserId(id: string): Promise<PaymentMethod[]> {
    const paymentMethods = await this.prisma.paymentMethod.findMany({
      where: { userId: id },
      include: {
        Issuer: true,
        Account: true,
        User: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return paymentMethods;
  }

  async findById(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
      include: {
        Issuer: true,
        Account: true,
        User: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return paymentMethod;
  }

  async update(
    id: string,
    data: Prisma.PaymentMethodCreateInput,
  ): Promise<PaymentMethod> {
    const updatedPaymentMethod = await this.prisma.paymentMethod.update({
      where: { id },
      data,
      include: {
        Issuer: true,
        Account: true,
        User: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return updatedPaymentMethod;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.paymentMethod.delete({
      where: { id },
    });
  }
}
