FROM oven/bun:1.2 as base

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json bun.lock ./

# Instalar dependências
RUN bun install --frozen-lockfile

# Copiar o restante dos arquivos
COPY . .

# Expor a porta que a aplicação usa
EXPOSE 8081

# Comando para iniciar a aplicação
CMD ["bun", "start"]
