FROM oven/bun:latest

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package.json ./
RUN bun install

# Definir variáveis de ambiente padrão
ENV API_URL=http://api-dev:8081
ENV DATA_FILE=/app/call_data.json
ENV INTERVAL_MS=60000

# Copiar o script e os dados
COPY scripts/data-sender.ts /app/
COPY scripts/call_data.json /app/

# Comando para executar o script
CMD ["bun", "data-sender.ts"]
