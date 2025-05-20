import UserLevel from '@users/entities/user-level';

export interface JwtPayload {
  sub: number;
  email: string;
  level: UserLevel;
  iat?: number;
  exp?: number;
}
