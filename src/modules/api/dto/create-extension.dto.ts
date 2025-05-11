import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO para criação de ramais
 */
export class CreateExtensionDto {
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  sector: string;

  @IsString()
  @IsNotEmpty()
  employee: string;
}
