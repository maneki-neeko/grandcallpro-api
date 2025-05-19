import { IsString, IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @IsNotEmpty()
  username: string; // Pode ser username ou email

  @IsString()
  @IsNotEmpty()
  password: string;
}
