import UserLevel from '@users/entities/user-level';

export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
  role: string;
  level: UserLevel;
  iat?: number;
  exp?: number;
}
