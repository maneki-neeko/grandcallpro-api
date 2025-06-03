# GrandCallPro API

API para receber, validar e persistir dados da UCM (Unidade de Controle de Módulos) do GrandCallPro.

## Requisitos

- [Bun](https://bun.sh) v1.2.11 ou superior
- Docker e Docker Compose (opcional, para conteineirização)

## Instalação

### Desenvolvimento local

Instale as dependências:

```bash
bun install
```

Inicie a aplicação em modo de desenvolvimento (hot-reload):

```bash
bun dev
```

Inicie a aplicação em modo de produção:

```bash
bun start
```

### Docker

Construa a imagem Docker:

```bash
bun docker:build
# ou
docker build -t grandcallpro-api .
```

Execute o container:

```bash
bun docker:run
# ou
docker run -p 8081:8081 grandcallpro-api
```

### Docker Compose

Inicie a aplicação em modo de produção:

```bash
docker-compose --profile prod up -d
```

Inicie a aplicação em modo de desenvolvimento (hot-reload):

```bash
docker-compose --profile dev up -d
```

## Estrutura do Projeto

- `src/modules/api` — Ramais, notificações e regras gerais da API
- `src/modules/core` — Núcleo: recebe, valida e persiste dados da UCM
- `src/modules/users` — Usuários, permissões e autenticação
- `src/modules/wrapper` — Backend for Frontend: integra módulos e monta dados para o frontend

## Principais Módulos

- **API**: Gerencia ramais e notificações
- **Core**: Processa e armazena dados da UCM
- **Usuários**: Cadastro, autenticação (JWT) e permissões
- **Wrapper**: Integração e montagem de dados para o frontend

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto contendo seu segredo JWT e a origem
permitida para conexões WebSocket:

```
JWT_SECRET=uma-chave-secreta-supersegura
WS_CORS_ORIGIN=http://localhost:3000
```

## Endpoints Principais

- `POST /data` — Recebe dados de chamada da UCM
- `GET /troubleshooting/data` — Lista registros de chamada (`limit`, `offset`)
- `GET /troubleshooting/data/:uniqueId` — Busca registro por uniqueId
- `POST /v1/auth/register` — Cadastro de usuário
- `POST /v1/auth/login` — Login (retorna JWT)
- `POST /v1/extensions` — Criação de ramal (autenticado)
- `GET /v1/extensions` — Lista ramais (autenticado)
- `POST /v1/users` — Criação de usuário (autenticado)
- `GET /v1/users` — Lista usuários (autenticado)

## Exemplo de Autenticação

1. Registre um usuário:

```bash
curl -X POST http://localhost:8081/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"user1","name":"User 1","email":"user1@example.com","department":"TI","password":"senha123","role":"developer","level":"USER"}'
```

2. Faça login:

```bash
curl -X POST http://localhost:8081/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"login":"user1","password":"senha123"}'
```

O token JWT retornado deve ser usado no header `Authorization`:

```
Authorization: Bearer <token>
```

## Banco de Dados

A aplicação utiliza SQLite e o arquivo `src/database/database.sqlite` é criado
automaticamente. Por segurança, ele está listado no `.gitignore` e não é
versionado.

## Testes

Execute os testes automatizados:

```bash
bun test
```

## Documentação da API (Swagger)

Após iniciar a aplicação, acesse:

    http://localhost:8081/docs

Você pode testar os endpoints diretamente pela interface web do Swagger.
