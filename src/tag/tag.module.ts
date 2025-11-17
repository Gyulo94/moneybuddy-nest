import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TagController } from './controller/tag.controller';
import { TagRepository } from './repository/tag.repository';
import { TagService } from './service/tag.service';

@Module({
  imports: [UserModule],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagService],
})
export class TagModule {}
