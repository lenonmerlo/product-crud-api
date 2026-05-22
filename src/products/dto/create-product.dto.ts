import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  codigoProduto: string;

  @IsString()
  @IsNotEmpty()
  descricaoProduto: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  fotoProduto?: string;
}
