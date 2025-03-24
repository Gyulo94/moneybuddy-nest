import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateTransactionDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const date = new Date(dto.date);
    if (dto.time) {
      const [hours, minutes] = dto.time.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    }

    const tagArr = await Promise.all(
      dto.tags.map(async (tagName) => {
        let tag = await this.prisma.tag.findUnique({
          where: { name: tagName },
        });
        if (!tag) {
          throw new NotFoundException();
        }
        return tag;
      }),
    );

    return await this.prisma.transaction.create({
      data: {
        date,
        amount: dto.amount,
        description: dto.description,
        type: dto.type,
        memo: dto.memo,
        user: { connect: { id: userId } },
        category: dto.categoryId ? { connect: { id: dto.categoryId } } : null,
        subCategory: dto.subCategoryId
          ? { connect: { id: dto.subCategoryId } }
          : null,
        tags: { connect: tagArr.map((tag) => ({ id: tag.id })) },
      },
      include: {
        category: true,
        subCategory: true,
        tags: true,
        user: true,
      },
    });
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
