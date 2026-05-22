import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'HNK-350', description: 'Código único do produto' })
  @IsString()
  @IsNotEmpty()
  codigoProduto!: string;

  @ApiProperty({
    example: 'Heineken Lata 350ml',
    description: 'Descrição do produto',
  })
  @IsString()
  @IsNotEmpty()
  descricaoProduto!: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Status do produto - true: ativo, false: inativo (padrão: true)',
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/produto-crud/heineken-350.jpg',
    description: 'URL da foto do produto',
  })
  @IsString()
  @IsOptional()
  fotoProduto?: string;
}
