import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
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

  async findAll(userId: string, type: 'INCOME' | 'EXPENSE') {
    const where: any = { userId };

    if (type) {
      where.type = type;
    }
    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        category: true,
        subCategory: true,
        tags: true,
        user: true,
      },
      orderBy: { date: 'desc' },
    });

    const groupedByDate = transactions.reduce(
      (acc, transaction) => {
        const dateKey = transaction.date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
      },
      {} as Record<string, any[]>,
    );
    const result = Object.entries(groupedByDate).map(([date, transactions]) => {
      const totalAmount = transactions.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const details = transactions.map((item) => ({
        id: item.id,
        time: format(new Date(item.date), 'HH:mm'),
        icon: item.category?.icon || '',
        color: item.category?.color || '',
        description: item.description,
        amount: item.amount,
        tags: item.tags.map((tag) => tag.name),
        category: item.category && item.category.name,
        subCategory: item.subCategory && item.subCategory.name,
        memo: item.memo || null,
      }));

      return {
        date: this.formatDate(date),
        totalAmount,
        details,
      };
    });
    return result;
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

  private formatDate(date: string): string {
    const paresedDate = new Date(date);
    return format(paresedDate, 'MM/dd (E)', { locale: ko });
  }
}
