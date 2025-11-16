import { UserResponse } from 'src/user/response/user.response';
import { TokenResponse } from './token.response';

export class AuthResponse {
  user: UserResponse;
  serverTokens: TokenResponse;

  static fromModel(
    user: UserResponse,
    serverTokens: TokenResponse,
  ): AuthResponse {
    return {
      user,
      serverTokens,
    } as AuthResponse;
  }
}
