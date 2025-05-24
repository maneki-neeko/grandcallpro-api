import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserLevel from './user-level';
import UserStatus from './user-status';
import { UserDto } from '@users/dto/user.dto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  department: string;

  @Column({ type: 'text', enum: UserStatus })
  status: UserStatus;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ type: 'text', enum: UserLevel })
  level: UserLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  activate() {
    this.status = UserStatus.ACTIVE;
  }

  toDto(): UserDto {
    return new UserDto(this);
  }
}
