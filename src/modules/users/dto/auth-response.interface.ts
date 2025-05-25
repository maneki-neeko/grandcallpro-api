import UserLevel from '@users/entities/user-level';
import UserStatus from '@users/entities/user-status';

interface User {
  id: number;
  email: string;
  status: UserStatus;
  name: string;
  level: UserLevel;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}
