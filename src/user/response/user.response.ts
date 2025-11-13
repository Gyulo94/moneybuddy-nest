import { Provider } from '@prisma/client';

export class UserResponse {
  id: string;
  name: string;
  email: string;
  image: string | null;
  provider: Provider;
  createdAt: Date;
}
