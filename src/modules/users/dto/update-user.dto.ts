import UserLevel from '@users/entities/user-level';
import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  level?: UserLevel;

  @IsString()
  @IsOptional()
  username?: string;
}
