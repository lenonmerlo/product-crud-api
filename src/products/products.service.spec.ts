import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';

const mockProduct = {
  id: 'uuid-1',
  codigoProduto: 'HNK-350',
  descricaoProduto: 'Heineken Lata 350ml',
  status: true,
  fotoProduto: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create({
        codigoProduto: 'HNK-350',
        descricaoProduto: 'Heineken Lata 350ml',
      });

      expect(result).toHaveProperty('id');
      expect(result.codigoProduto).toBe('HNK-350');
    });

    it('should throw on duplicate codigoProduto', async () => {
      const prismaError = {
        code: 'P2002',
        constructor: { name: 'PrismaClientKnownRequestError' },
      };
      mockPrismaService.product.create.mockRejectedValue(
        Object.assign(new Error(), prismaError),
      );

      await expect(
        service.create({
          codigoProduto: 'HNK-350',
          descricaoProduto: 'Heineken Lata 350ml',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('uuid-1');
      expect(result.id).toBe('uuid-1');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        descricaoProduto: 'Heineken Lata 350ml Gelada',
      });

      const result = await service.update('uuid-1', {
        descricaoProduto: 'Heineken Lata 350ml Gelada',
      });

      expect(result.descricaoProduto).toBe('Heineken Lata 350ml Gelada');
    });

    it('should throw NotFoundException if product not found on update', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { descricaoProduto: 'Teste' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove('uuid-1');
      expect(result.id).toBe('uuid-1');
    });

    it('should throw NotFoundException if product not found on delete', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
