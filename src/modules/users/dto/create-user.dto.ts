import UserLevel from '@users/entities/user-level';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, Matches } from 'class-validator';
import { USERNAME_REGEX, USERNAME_REGEX_MESSAGE } from '../constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(USERNAME_REGEX, {
    message: USERNAME_REGEX_MESSAGE,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserLevel)
  level: UserLevel;
}
