import 'reflect-metadata';
import express from 'express';
import type { Request, Response } from 'express';
import { coreRoutes } from './src/modules/core';
import { initializeDatabase } from './src/database';

// Configuração do servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Rotas do módulo core
app.use('/', coreRoutes);

// Rota raiz
app.get('/ping', (req: Request, res: Response) => {
  res.send('Pong!');
});

// Função para inicializar o servidor
async function bootstrap() {
  try {
    // Inicializa o banco de dados
    await initializeDatabase();
    console.log('Banco de dados inicializado com sucesso');
    
    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    process.exit(1);
  }
}

// Inicia a aplicação
bootstrap();
