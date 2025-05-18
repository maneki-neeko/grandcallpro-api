import UserLevel from '@users/entities/user-level';

interface User {
  id: number;
  email: string;
  name: string;
  level: UserLevel;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
