import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Tag, User } from '@prisma/client';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { UserService } from 'src/user/service/user.service';
import { TagResponse } from '../controller/response/tag.response';
import { TagRepository } from '../repository/tag.repository';
import { TagRequest } from '../request/tag.request';

@Injectable()
export class TagService {
  private readonly LOGGER = new Logger(TagService.name);
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly userService: UserService,
  ) {}

  async findAllByUserId(userId: string): Promise<TagResponse[]> {
    const tags = await this.tagRepository.findAllByUserId(userId);
    const response: TagResponse[] = tags.map((tag) =>
      TagResponse.fromModel(tag),
    );
    return response;
  }

  private filterNewTags(
    tags: TagRequest[],
    existingTags: Tag[],
    user: User,
  ): Prisma.TagCreateManyInput[] {
    this.LOGGER.log(
      `5. 필터링할 태그들: ${JSON.stringify(tags.map((t) => t.name).join(', '))}`,
    );
    const filteredTags = tags.filter(
      (tag: TagRequest) => !this.isExistingTag(tag.name, existingTags),
    );
    this.LOGGER.log(
      `7. 필터링된 새로운 태그들: ${JSON.stringify(filteredTags.map((t) => t.name).join(', '))}`,
    );

    const mappedTags: Prisma.TagCreateManyInput[] = filteredTags.map(
      (tag: TagRequest) => tag.toModel(user.id),
    );

    this.LOGGER.log(
      `8. 새로운 태그들 모델로 매핑 완료: ${JSON.stringify(mappedTags.map((t) => t.name).join(', '))}`,
    );
    return mappedTags;
  }

  private isExistingTag(name: string, existingTags: Tag[]): boolean {
    const isExisting = existingTags.some(
      (existingTag) => existingTag.name === name,
    );
    this.LOGGER.log(`6. 태그 존재 여부 확인: ${name} - ${isExisting}`);
    return isExisting;
  }

  @Transactional()
  async saveTags(tags: TagRequest[], userId: string): Promise<Tag[]> {
    this.LOGGER.log(`
      --------------------태그 저장 서비스 실행--------------------`);
    if (!tags || tags.length === 0) {
      this.LOGGER.log(`태그가 비어있습니다.`);
      return [];
    }

    this.LOGGER.log(`1. 기존 태그 조회 시작`);
    const existingTags = await this.tagRepository.findAllByUserId(userId);
    this.LOGGER.log(`2. 기존 태그 조회 완료`);

    this.LOGGER.log(`3. 새로운 태그 필터링 시작`);
    const user = await this.userService.findById(userId);
    const newTags = this.filterNewTags(tags, existingTags, user);
    this.LOGGER.log(`9. 새로운 태그 필터링 완료`);
    if (newTags.length > 0) {
      this.LOGGER.log(`10. 새로운 태그 저장 시작`);
      await this.tagRepository.saveAll(newTags);
      this.LOGGER.log(`11. 새로운 태그 저장 완료`);
    }
    this.LOGGER.log(`12. 요청된 태그들 중 저장된 태그들 조회 시작`);
    const requestedNames = new Set(tags.map((tag) => tag.name));
    this.LOGGER.log(`13. 요청된 태그들: ${JSON.stringify(requestedNames)}`);

    const persistedTagsFromDb =
      await this.tagRepository.findAllByUserId(userId);
    this.LOGGER.log(`14. 요청된 태그들 중 저장된 태그들 조회 완료`);
    const response = persistedTagsFromDb.filter((tag) =>
      requestedNames.has(tag.name),
    );
    this.LOGGER.log(
      `15. 최종 태그들: ${JSON.stringify(response.map((t) => t.name).join(', '))}`,
    );
    this.LOGGER.log(
      `--------------------태그 저장 서비스 종료--------------------`,
    );
    return response;
  }
}
