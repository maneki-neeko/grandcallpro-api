import UserLevel from '@users/entities/user-level';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  level: UserLevel;
  iat?: number;
  exp?: number;
}
