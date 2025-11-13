import { Injectable } from '@nestjs/common';
import { EntityType, Provider, User } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { ApiException } from 'src/global/exception/api.exception';
import { ImageService } from 'src/image/service/image.service';
import { RedisService } from 'src/redis/service/redis.service';
import { UserRepository } from '../repository/user.repository';
import { CreateUserRequest } from '../request/create-user.request';
import { UpdateUserRequest } from '../request/update-user.request';
import { UserResponse } from '../response/user.response';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redis: RedisService,
    private readonly imageService: ImageService,
  ) {}

  @Transactional()
  async signup(request: CreateUserRequest): Promise<UserResponse> {
    const { token, provider, id, image, password, email, ...res } = request;

    const existingUser: User = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiException(ErrorCode.ALREADY_EXIST_EMAIL);
    }

    const hashedPassword = provider ? '' : await hashSync(password, 10);

    const data: User = {
      ...res,
      email,
      password: hashedPassword,
      provider: provider ? provider : Provider.이메일,
      id: provider === Provider.이메일 ? undefined : id,
      createdAt: new Date(),
    };

    const user = await this.userRepository.save(data);

    if (image) {
      const requestObj = {
        id: user.id,
        images: [image],
        existingImages: [],
        entity: EntityType.USER,
      };

      const newImage = await this.imageService
        .createImages(requestObj)
        .then((urls) => urls[0] || null);

      return {
        ...user,
        image: newImage[0] || null,
      };
    }

    if (provider !== null) {
      await this.redis.del(token);
    }
    return {
      ...user,
      image: null,
    };
  }

  @Transactional()
  async resetPassword(dto: UpdateUserRequest): Promise<void> {
    const { token, password, email } = dto;

    const user = await this.findByEmail(email);

    if (!user) {
      throw new ApiException(ErrorCode.USER_NOT_FOUND);
    }

    if (user && compareSync(password, user.password)) {
      throw new ApiException(ErrorCode.SAME_ORIGINAL_PASSWORD);
    }

    const hashedPassword = await hashSync(password, 10);

    const data = {
      ...user,
      password: hashedPassword,
    };

    await this.userRepository.update(data);

    await this.redis.del(token);
  }

  async findByEmail(email: string): Promise<User> {
    const response: User = await this.userRepository.findByEmail(email);
    return response;
  }

  async findById(id: string): Promise<User> {
    const response: User = await this.userRepository.findById(id);
    if (!response) {
      throw new ApiException(ErrorCode.USER_NOT_FOUND);
    }
    return response;
  }

  @Transactional()
  async getMe(userId: string): Promise<UserResponse> {
    const user: User = await this.findById(userId);
    const image = await this.imageService
      .findByEntityIdAndEntityType(user.id, EntityType.USER)
      .then((urls) => urls[0] || null);
    return {
      ...user,
      image,
    };
  }
}
