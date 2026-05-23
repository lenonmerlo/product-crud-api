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
![Railway](https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=flat&logo=railway&logoColor=white)

## Sumario

- [Visao geral](#visao-geral)
- [Links em producao](#links-em-producao)
- [Stack e arquitetura](#stack-e-arquitetura)
- [Funcionalidades](#funcionalidades)
- [Executando localmente](#executando-localmente)
- [Variaveis de ambiente](#variaveis-de-ambiente)
- [Banco de dados e Prisma](#banco-de-dados-e-prisma)
- [Documentacao da API](#documentacao-da-api)
- [Autenticacao](#autenticacao)
- [Endpoints](#endpoints)
- [Formato de erros](#formato-de-erros)
- [Qualidade e CI](#qualidade-e-ci)
- [Deploy](#deploy)
- [Estrutura do projeto](#estrutura-do-projeto)

## Visao geral

Esta API foi desenvolvida em NestJS com foco em boas praticas de organizacao em modulos, validacao de dados, tratamento padronizado de erros e deploy em ambiente cloud.

O projeto cobre:

- cadastro e autenticacao de usuarios com JWT
- CRUD de produtos protegido por autenticacao
- upload de imagem de produto com Cloudinary
- listagem paginada com ordenacao priorizando produtos ativos
- seed inicial de produtos para ambiente de desenvolvimento
- pipeline de build em GitHub Actions
- deploy em Railway com healthcheck

## Links em producao

- API: https://product-crud-api-production.up.railway.app
- Swagger: https://product-crud-api-production.up.railway.app/api
- Health: https://product-crud-api-production.up.railway.app/health

Observacao:

- a aplicacao responde healthcheck em `/health`
- a rota raiz `/` tambem responde status para compatibilidade de plataforma

## Stack e arquitetura

Tecnologias principais:

- NestJS
- TypeScript
- Prisma ORM v7 com driver adapter `@prisma/adapter-pg`
- PostgreSQL
- JWT + Passport
- Cloudinary
- Swagger
- GitHub Actions
- Railway

Padroes utilizados:

- arquitetura por modulos (auth, products, prisma, upload)
- DTOs com `class-validator` e transformacao com `class-transformer`
- filtros globais para erros HTTP e erros do Prisma
- CORS configuravel por variavel de ambiente

## Funcionalidades

- cadastro de usuario
- login com emissao de `accessToken` JWT
- criacao, leitura, atualizacao e exclusao de produtos
- upload de imagem de produto com limites e validacao
- ordenacao de listagem: ativos primeiro, depois mais recentes
- paginacao com `page` e `limit`
- padronizacao de resposta de erro

## Executando localmente

### Pre-requisitos

- Node.js 22+
- npm 10+
- PostgreSQL em execucao
- conta Cloudinary

### Instalacao

```bash
git clone https://github.com/lenonmerlo/product-crud-api.git
cd product-crud-api
npm install
```

### Configurar ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

### Subir aplicacao

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Servidor local:

- API: http://localhost:3333
- Swagger: http://localhost:3333/api
- Health: http://localhost:3333/health

## Variaveis de ambiente

Exemplo:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lippaus_db"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JWT_SECRET=
PORT=3333
CORS_ORIGIN=http://localhost:3000
```

Descricao:

- `DATABASE_URL`: conexao principal com PostgreSQL
- `CLOUDINARY_CLOUD_NAME`: nome da cloud no Cloudinary
- `CLOUDINARY_API_KEY`: chave publica da API Cloudinary
- `CLOUDINARY_API_SECRET`: segredo da API Cloudinary
- `JWT_SECRET`: segredo para assinatura e validacao de token JWT
- `PORT`: porta HTTP da API (padrao 3333)
- `CORS_ORIGIN`: lista separada por virgula de origens permitidas

## Banco de dados e Prisma

O projeto usa Prisma com PostgreSQL e inclui migrations versionadas em `prisma/migrations`.

Comandos uteis:

```bash
# gerar client
npx prisma generate

# criar/aplicar migration em dev
npx prisma migrate dev

# popular dados iniciais (seed)
npx prisma db seed

# aplicar migrations em producao
npx prisma migrate deploy
```

O comando de seed esta configurado em `prisma.config.ts` e executa `prisma/seed.ts`.

Modelos principais:

- `User`: autenticao e acesso
- `Product`: dados de catalogo com status e foto

## Documentacao da API

A documentacao Swagger fica disponivel em `/api`.

Ela inclui:

- schemas de request/response
- autenticacao bearer
- descricao de rotas

## Autenticacao

Fluxo:

1. Criar usuario em `POST /auth/register`
2. Fazer login em `POST /auth/login`
3. Copiar `accessToken` retornado
4. Enviar token no header `Authorization: Bearer <token>`

Todas as rotas de `products` estao protegidas por `JwtAuthGuard`.

## Endpoints

### Auth

| Metodo | Rota           | Protegida | Descricao              |
| ------ | -------------- | --------- | ---------------------- |
| POST   | /auth/register | Nao       | Cadastro de usuario    |
| POST   | /auth/login    | Nao       | Login e emissao de JWT |

### Products

| Metodo | Rota                | Protegida | Descricao                                            |
| ------ | ------------------- | --------- | ---------------------------------------------------- |
| POST   | /products           | Sim       | Criar produto                                        |
| GET    | /products           | Sim       | Listar com paginacao e ordenacao por status          |
| GET    | /products/:id       | Sim       | Buscar produto por ID                                |
| PUT    | /products/:id       | Sim       | Atualizar produto                                    |
| DELETE | /products/:id       | Sim       | Remover produto                                      |
| POST   | /products/:id/image | Sim       | Upload de imagem (multipart/form-data, campo `file`) |

### Health

| Metodo | Rota    | Protegida | Descricao                      |
| ------ | ------- | --------- | ------------------------------ |
| GET    | /health | Nao       | Healthcheck principal          |
| GET    | /       | Nao       | Healthcheck de compatibilidade |

## Formato de erros

A API usa filtros globais para padronizar erros HTTP e erros conhecidos do Prisma.

Formato padrao:

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro",
  "timestamp": "2026-05-22T20:00:00.000Z",
  "path": "/products"
}
```

Exemplos tratados:

- conflito de chave unica (`P2002`)
- registro nao encontrado (`P2025`)
- falhas de validacao de DTO

## Qualidade e CI

Scripts disponiveis:

```bash
npm run build
npm run lint
npm run lint:fix
npm run test
npm run test:e2e
```

Pipeline GitHub Actions (`.github/workflows/build.yml`):

- instala dependencias
- gera Prisma Client
- executa build

## Deploy

Deploy configurado para Railway com Dockerfile e `railway.json`.

Resumo do processo de runtime:

1. container inicia
2. `prisma migrate deploy`
3. `npm run start:prod`
4. Railway valida `healthcheckPath: /health`

Arquivos de deploy:

- `Dockerfile`
- `railway.json`
- `prisma.config.ts`

## Estrutura do projeto

```text
src/
	auth/
		dto/
		auth.controller.ts
		auth.module.ts
		auth.service.ts
		jwt-auth.guard.ts
		jwt.strategy.ts
	common/
		filters/
			http-exception.filter.ts
			prisma-exception.filter.ts
	prisma/
		prisma.module.ts
		prisma.service.ts
	products/
		dto/
		products.controller.ts
		products.module.ts
		products.service.ts
	upload/
		cloudinary.storage.ts
		upload.module.ts
		upload.service.ts
	app.controller.ts
	app.module.ts
	app.service.ts
	main.ts
prisma/
	schema.prisma
	migrations/
```
