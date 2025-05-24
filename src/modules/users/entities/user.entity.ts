import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
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
  @Exclude()
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
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      department: this.department,
      status: this.status,
      role: this.role,
      level: this.level,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
