import UserStatus from '@users/entities/user-status';
import UserLevel from '@users/entities/user-level';
import { User } from '@users/entities/user.entity';

export class UserDto {
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

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.username = user.username;
    this.department = user.department;
    this.status = user.status;
    this.role = user.role;
    this.level = user.level;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
