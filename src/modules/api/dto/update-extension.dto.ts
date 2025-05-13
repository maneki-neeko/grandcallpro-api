import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO para atualização de ramais
 */
export class UpdateExtensionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
