import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

type Product = {
  id: string;
  codigoProduto: string;
  descricaoProduto: string;
  status: boolean;
  fotoProduto: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateThumbnailUrl(url: string | null): string | null {
    if (!url) return null;
    return url.replace('/upload/', '/upload/w_150,h_150,c_fill/');
  }

  private formatProduct(product: Product) {
    return {
      ...product,
      thumbnailUrl: this.generateThumbnailUrl(product.fotoProduto),
    };
  }

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Já existe um produto com o código '${dto.codigoProduto}'`,
        );
      }
      throw error;
    }
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: data.map((p) => this.formatProduct(p)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Produto com ID '${id}' não encontrado`);
    return this.formatProduct(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
    });
    return this.formatProduct(updated);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.product.delete({ where: { id } });
  }

  async updateImage(id: string, imageUrl: string) {
    await this.findOne(id);
    const updated = await this.prisma.product.update({
      where: { id },
      data: { fotoProduto: imageUrl },
    });
    return this.formatProduct(updated);
  }
}
