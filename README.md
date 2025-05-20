# GrandCallPro API

API para receber, validar e persistir dados da UCM (Unidade de Controle de Módulos) do GrandCallPro.

## Requisitos

- [Bun](https://bun.sh) v1.2.11 ou superior
- Docker e Docker Compose (opcional, para conteineirização)

## Instalação

### Desenvolvimento local

Instalar dependências:

```bash
bun install
```

Iniciar a aplicação em modo de desenvolvimento (com hot-reload):

```bash
bun dev
```

Iniciar a aplicação em modo de produção:

```bash
bun start
```

### Docker

Construir a imagem Docker:

```bash
bun docker:build
# ou
docker build -t grandcallpro-api .
```

Executar o container:

```bash
bun docker:run
# ou
docker run -p 3000:3000 grandcallpro-api
```

### Docker Compose

Iniciar a aplicação em modo de produção:

```bash
docker-compose --profile prod up -d
```

Iniciar a aplicação em modo de desenvolvimento (com hot-reload):

```bash
docker-compose --profile dev up -d
```

## Endpoints

- `POST /data` - Recebe dados de chamada da UCM
- `GET /troubleshooting/data` - Lista todos os registros de chamada (com paginação via query params `limit` e `offset`)
- `GET /troubleshooting/data/:uniqueId` - Busca registros de chamada por uniqueId

## Banco de Dados

A aplicação utiliza SQLite como banco de dados, com o arquivo localizado em `src/database/call_records.db`.

## Documentação da API (Swagger)

Após iniciar a aplicação, acesse a documentação automática e interativa dos endpoints em:

    http://localhost:8081/docs

Você pode testar os endpoints diretamente pela interface web do Swagger.
