import UserLevel from '@users/entities/user-level';
import { IsString, IsEmail, IsOptional, Matches } from 'class-validator';
import { USERNAME_REGEX, USERNAME_REGEX_MESSAGE } from '../constants';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(USERNAME_REGEX, {
    message: USERNAME_REGEX_MESSAGE,
  })
  username?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  level?: UserLevel;
}
