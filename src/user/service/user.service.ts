import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityType, Provider, User } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { UserSignupEvent } from 'src/global/event/user-signup.event';
import { ApiException } from 'src/global/exception/api.exception';
import { ImageRequest } from 'src/image/request/image.request';
import { ImageService } from 'src/image/service/image.service';
import { RedisService } from 'src/redis/service/redis.service';
import { v4 as uuid } from 'uuid';
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
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async signup(request: CreateUserRequest): Promise<UserResponse> {
    const { token, provider, image, password, email, ...res } = request;

    const existingUser: User = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiException(ErrorCode.ALREADY_EXIST_EMAIL);
    }

    const hashedPassword = provider ? '' : await hashSync(password, 10);

    const data: CreateUserRequest = {
      ...res,
      id: uuid(),
      email,
      password: hashedPassword,
      provider: provider ? provider : Provider.이메일,
    };

    const user = await this.userRepository.save(data);

    const requestObj: ImageRequest = {
      id: user.id,
      entity: EntityType.USER,
      images: [image],
      existingImages: [],
    };

    const savedImage = await this.imageService
      .createImages(requestObj)
      .then((urls) => urls[0] || null);

    if (provider !== null) {
      await this.redis.del(token);
    }

    await this.eventEmitter.emitAsync(
      'user.signup',
      new UserSignupEvent(user.id),
    );

    return {
      ...user,
      image: savedImage || null,
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
