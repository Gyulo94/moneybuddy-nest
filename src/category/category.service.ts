import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateCategoryDto) {
    const { name, color, icon, type } = dto;
    return await this.prisma.category.create({
      data: {
        name,
        color,
        icon,
        type,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      include: { subCategories: true },
    });
  }

  async findByExpense() {
    return await this.prisma.category.findMany({
      where: {
        type: 'EXPENSE',
      },
      include: { subCategories: true },
    });
  }

  async findByIncome() {
    return await this.prisma.category.findMany({
      where: {
        type: 'INCOME',
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async subCreate(dto: CreateCategoryDto, id: string) {
    const { name } = dto;
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }
    return await this.prisma.subCategory.create({
      data: {
        name,
        category: {
          connect: { id },
        },
      },
    });
  }
}
