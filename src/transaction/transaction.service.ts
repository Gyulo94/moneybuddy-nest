import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateTransactionDto) {
    console.log('Service', dto);
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저의 ID입니다.');
    }

    const date = new Date(dto.date);
    date.setUTCHours(0, 0, 0, 0);
    console.log('date', date);

    if (dto.time) {
      const [hours, minutes] = dto.time.split(':').map(Number);
      date.setUTCHours(hours, minutes, 0, 0);
    }

    return await this.prisma.transaction.create({
      data: {
        date,
        amount: dto.amount,
        description: dto.description,
        type: dto.type,
        memo: dto.memo || null,
        user: { connect: { id: dto.userId } },
        category: dto.categoryId ? { connect: { id: dto.categoryId } } : null,
        subCategory: dto.subCategoryId
          ? { connect: { id: dto.subCategoryId } }
          : null,
        tags: {
          connect: dto.tags.map((tagId) => ({ id: tagId })),
        },
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
    return this.prisma.transaction.findMany({
      include: {
        category: true,
        subCategory: true,
        tags: true,
        user: true,
      },
    });
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
