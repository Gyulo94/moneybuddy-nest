import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  // 인증 관련 에러
  UNAUTHORIZED = 'AUTH_001',
  INVALID_TOKEN = 'AUTH_002',
  INCORRECT_EMAIL_OR_PASSWORD = 'AUTH_003',
  REQUIRED_LOGIN = 'AUTH_004',
  VERIFICATION_EMAIL_TOKEN_FAILED = 'AUTH_005',
  TOO_MANY_REFRESH_REQUESTS = 'AUTH_006',
  ALREADY_EXIST_EMAIL = 'AUTH_007',

  // 은행 관련 에러
  BANK_NOT_FOUND = 'BANK_001',

  // 계좌 관련 에러
  ACCOUNT_NOT_FOUND = 'ACCOUNT_001',
  CREATE_ACCOUNT_FAILED = 'ACCOUNT_002',

  // 사용자 관련 에러
  USER_NOT_FOUND = 'USER_001',
  DUPLICATE_EMAIL = 'USER_002',
  NOT_FOUND_EMAIL = 'USER_003',
  SAME_ORIGINAL_PASSWORD = 'USER_004',
  NOT_ALLOWED_SOCIAL_USER = 'USER_005',
  INVALID_REFRESH_TOKEN = 'USER_006',

  // 기타 일반 에러
  INTERNAL_SERVER_ERROR = 'SERVER_001',
  BAD_REQUEST = 'COMMON_001',
  FORBIDDEN = 'COMMON_002',
}

export const ErrorCodeMap: Record<
  ErrorCode,
  { status: HttpStatus; message: string }
> = {
  // 인증 관련
  [ErrorCode.UNAUTHORIZED]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '인증 정보가 유효하지 않습니다. 다시 로그인 해주세요.',
  },
  [ErrorCode.INVALID_TOKEN]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않거나 만료된 토큰입니다.',
  },
  [ErrorCode.INCORRECT_EMAIL_OR_PASSWORD]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  [ErrorCode.REQUIRED_LOGIN]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '로그인이 필요합니다.',
  },
  [ErrorCode.NOT_ALLOWED_SOCIAL_USER]: {
    status: HttpStatus.FORBIDDEN,
    message: '소셜 로그인 사용자는 이용이 불가능합니다.',
  },
  [ErrorCode.VERIFICATION_EMAIL_TOKEN_FAILED]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 인증 토큰이 유효하지 않습니다.',
  },
  [ErrorCode.INVALID_REFRESH_TOKEN]: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않거나 만료된 리프레시 토큰입니다.',
  },
  [ErrorCode.TOO_MANY_REFRESH_REQUESTS]: {
    status: HttpStatus.TOO_MANY_REQUESTS,
    message:
      '리프레시 토큰 갱신 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  },
  [ErrorCode.ALREADY_EXIST_EMAIL]: {
    status: HttpStatus.CONFLICT,
    message: '이미 존재하는 이메일입니다.',
  },

  // 은행 관련
  [ErrorCode.BANK_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 은행을 찾을 수 없습니다.',
  },

  // 계좌 관련
  [ErrorCode.ACCOUNT_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 계좌를 찾을 수 없습니다.',
  },
  [ErrorCode.CREATE_ACCOUNT_FAILED]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '계좌 생성에 실패했습니다.',
  },

  // 사용자 관련
  [ErrorCode.USER_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 유저를를 찾을 수 없습니다.',
  },
  [ErrorCode.DUPLICATE_EMAIL]: {
    status: HttpStatus.CONFLICT,
    message: '이미 사용 중인 이메일입니다.',
  },
  [ErrorCode.NOT_FOUND_EMAIL]: {
    status: HttpStatus.NOT_FOUND,
    message: '해당 이메일을 찾을 수 없습니다.',
  },
  [ErrorCode.SAME_ORIGINAL_PASSWORD]: {
    status: HttpStatus.CONFLICT,
    message: '기존 비밀번호와 동일합니다.',
  },

  // 기타 일반
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '서버 내부 오류가 발생했습니다.',
  },
  [ErrorCode.BAD_REQUEST]: {
    status: HttpStatus.BAD_REQUEST,
    message: '잘못된 요청입니다.',
  },
  [ErrorCode.FORBIDDEN]: {
    status: HttpStatus.FORBIDDEN,
    message: '잘못된 접근입니다.',
  },
};
