# Product CRUD API

API RESTful para cadastro e gerenciamento de produtos, desenvolvida como teste tecnico.

![CI](https://github.com/lenonmerlo/product-crud-api/actions/workflows/build.yml/badge.svg)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## Tecnologias

- **NestJS** - framework Node.js
- **TypeScript** - tipagem estatica
- **Prisma ORM** - acesso ao banco de dados
- **PostgreSQL** - banco de dados relacional
- **Cloudinary** - armazenamento de imagens
- **JWT + Passport** - autenticacao
- **Swagger** - documentacao interativa
- **GitHub Actions** - CI/CD

## Funcionalidades

- CRUD completo de produtos
- Upload de imagem via Cloudinary
- Listagem com produtos ativos em destaque
- Paginacao na listagem
- Validacao em multiplos niveis (DTO, service e banco)
- Cadastro e autenticacao de usuarios com JWT
- Rotas de produtos protegidas por autenticacao
- Documentacao interativa via Swagger
- CI com GitHub Actions

## Como rodar localmente

### Pre-requisitos

- Node.js 22+
- PostgreSQL
- Conta no Cloudinary

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/lenonmerlo/product-crud-api.git
cd product-crud-api

# Instale as dependencias
npm install

# Configure as variaveis de ambiente
cp .env.example .env
# Preencha o .env com suas credenciais
```

### Variaveis de ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lippaus_db"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JWT_SECRET=
PORT=3333
```

### Rodando

```bash
# Gerar o Prisma Client
npx prisma generate

# Rodar as migrations
npx prisma migrate dev

# Iniciar em modo desenvolvimento
npm run start:dev
```

## Documentacao

Com o servidor rodando, acesse a documentacao interativa:

```
http://localhost:3333/api
```

## Autenticacao

A API utiliza JWT. Para acessar os endpoints de produtos:

1. Crie uma conta em `POST /auth/register`
2. Faca login em `POST /auth/login` e copie o `accessToken`
3. No Swagger, clique em **Authorize** e cole o token

## Endpoints

### Auth

| Metodo | Rota           | Descricao                    |
| ------ | -------------- | ---------------------------- |
| POST   | /auth/register | Cadastrar usuario            |
| POST   | /auth/login    | Login e geracao de token JWT |

### Products (requer autenticacao)

| Metodo | Rota                | Descricao                                   |
| ------ | ------------------- | ------------------------------------------- |
| POST   | /products           | Criar produto                               |
| GET    | /products           | Listar produtos (ativos primeiro, paginado) |
| GET    | /products/:id       | Buscar produto por ID                       |
| PUT    | /products/:id       | Atualizar produto                           |
| DELETE | /products/:id       | Deletar produto                             |
| POST   | /products/:id/image | Upload de imagem                            |

### Health

| Metodo | Rota | Descricao    |
| ------ | ---- | ------------ |
| GET    | /    | Health check |

## Estrutura do projeto

```
src/
├── auth/               # Modulo de autenticacao
│   ├── dto/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
├── common/
│   └── filters/        # Exception filters globais
├── prisma/             # Modulo do Prisma
├── products/           # Modulo de produtos
│   └── dto/
└── upload/             # Modulo de upload de imagem
```
