import { IsString, IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
