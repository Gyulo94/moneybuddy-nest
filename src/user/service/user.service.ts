import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Image, User } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { Transactional } from 'src/global/decorator/transactional.decorator';
import { ErrorCode } from 'src/global/enum/error-code.enum';
import { UserSignupEvent } from 'src/global/event/user-signup.event';
import { ApiException } from 'src/global/exception/api.exception';
import { ImageService } from 'src/image/service/image.service';
import { RedisService } from 'src/redis/service/redis.service';
import { v4 as uuid } from 'uuid';
import { UserRepository } from '../repository/user.repository';
import { UserRequest } from '../request/user.request';
import { UserResponse } from '../response/user.response';

@Injectable()
export class UserService {
  private readonly LOGGER = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redis: RedisService,
    private readonly imageService: ImageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async signup(request: UserRequest): Promise<UserResponse> {
    const { token, provider, image, password, email } = request;
    this.LOGGER.log(
      '--------------------유저 생성 서비스 실행--------------------',
    );

    const existingUser: User = await this.userRepository.findByEmail(email);
    this.LOGGER.log(
      `1. 기존 유저 조회: ${existingUser ? '존재함' : '존재하지 않음'}`,
    );
    if (existingUser) {
      throw new ApiException(ErrorCode.ALREADY_EXIST_EMAIL);
    }

    const id = uuid();
    this.LOGGER.log(`2. 새로운 유저 ID 생성`);

    const hashedPassword = provider ? '' : await hashSync(password, 10);
    this.LOGGER.log(`3. 비밀번호 해싱 완료`);

    this.LOGGER.log(`4. 이미지 생성 예정 (일반계정이면 건너뜀 7번으로 넘어감)`);
    let userImage: Image = null;
    if (image) {
      this.LOGGER.log(`5. 이미지 생성 시작`);
      userImage = await this.imageService.createUserImage(image);
      this.LOGGER.log(`6. 이미지 생성 완료`);
    }

    this.LOGGER.log(`7. 유저 엔티티 생성 완료`);

    const user = await this.userRepository.create(
      request.toModel(id, hashedPassword, userImage ? userImage.id : null),
    );
    this.LOGGER.log(`8. 유저 저장 완료`);

    this.LOGGER.log(`9. 이메일 토큰 삭제 및 회원가입 이벤트 실행`);
    if (provider !== null) {
      await this.redis.del(token);
      this.LOGGER.log(`10. 이메일 토큰 삭제 완료`);
    }
    await this.eventEmitter.emitAsync(
      'user.signup',
      new UserSignupEvent(user.id),
    );
    this.LOGGER.log(`11. 회원가입 이벤트 실행 완료`);

    const response: UserResponse = UserResponse.fromModel(user);

    this.LOGGER.log(
      '--------------------유저 생성 서비스 종료--------------------',
    );
    return response;
  }

  @Transactional()
  async resetPassword(request: Partial<UserRequest>): Promise<void> {
    this.LOGGER.log(
      '--------------------비밀번호 재설정 서비스 실행--------------------',
    );
    const { token, password, email } = request;

    const user = await this.findByEmail(email);
    this.LOGGER.log(`1. 유저 조회: ${user ? '존재함' : '존재하지 않음'}`);

    if (!user) {
      this.LOGGER.error(`유저가 존재하지 않으므로 예외 발생`);
      throw new ApiException(ErrorCode.USER_NOT_FOUND);
    }

    this.LOGGER.log(`2. 기존 비밀번호와 일치하는가?`);
    if (user && compareSync(password, user.password)) {
      this.LOGGER.error(`비밀번호가 기존 비밀번호와 일치하므로 예외 발생`);
      throw new ApiException(ErrorCode.SAME_ORIGINAL_PASSWORD);
    }

    const hashedPassword = await hashSync(password, 10);

    this.LOGGER.log(`3. 비밀번호 해싱 완료 및 유저 비밀번호 업데이트`);
    await this.userRepository.update(
      request.toModel(user.id, hashedPassword, user.imageId),
    );

    this.LOGGER.log(`4. 이메일 토큰 삭제`);
    await this.redis.del(token);

    this.LOGGER.log(
      '--------------------비밀번호 재설정 서비스 종료--------------------',
    );
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

  async getMe(userId: string): Promise<UserResponse> {
    const user: User = await this.findById(userId);
    const response = UserResponse.fromModel(user);
    return response;
  }
}
