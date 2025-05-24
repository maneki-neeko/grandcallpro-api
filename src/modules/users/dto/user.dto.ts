import UserStatus from '@users/entities/user-status';
import UserLevel from '@users/entities/user-level';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  username: string;
  department: string;
  status: UserStatus;
  role: string;
  level: UserLevel;
  createdAt: Date;
  updatedAt: Date;
}
