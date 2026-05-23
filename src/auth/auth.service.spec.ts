import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-1',
        name: 'Carlos Oliveira',
        email: 'carlos@lippaus.com.br',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register({
        name: 'Carlos Oliveira',
        email: 'carlos@lippaus.com.br',
        password: 'senha123',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', 'carlos@lippaus.com.br');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'uuid-1' });

      await expect(
        service.register({
          name: 'Carlos Oliveira',
          email: 'carlos@lippaus.com.br',
          password: 'senha123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return accessToken and user on valid credentials', async () => {
      const hash = await bcrypt.hash('senha123', 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        name: 'Carlos Oliveira',
        email: 'carlos@lippaus.com.br',
        password: hash,
      });

      const result = await service.login({
        email: 'carlos@lippaus.com.br',
        password: 'senha123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('email', 'carlos@lippaus.com.br');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'naoexiste@email.com',
          password: 'senha123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const hash = await bcrypt.hash('senha123', 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        name: 'Carlos Oliveira',
        email: 'carlos@lippaus.com.br',
        password: hash,
      });

      await expect(
        service.login({
          email: 'carlos@lippaus.com.br',
          password: 'senhaerrada',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
