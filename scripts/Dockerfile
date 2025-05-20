FROM oven/bun:latest

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package.json ./
RUN bun install

# Copiar o script e os dados
COPY scripts/data-sender.ts /app/
COPY scripts/call-data.json /app/cd

# Comando para executar o script
CMD ["bun", "data-sender.ts"]
