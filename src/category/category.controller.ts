import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Post(':id/sub')
  subCreate(@Body() dto: CreateCategoryDto, @Param('id') id: string) {
    console.log(dto, id);

    return this.categoryService.subCreate(dto, id);
  }

  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @Get('expense')
  findByExpense() {
    return this.categoryService.findByExpense();
  }

  @Public()
  @Get('income')
  findByIncome() {
    return this.categoryService.findByIncome();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
