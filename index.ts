import express from 'express';
import { coreRoutes } from './src/modules/core';

// Configuração do servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Rotas do módulo core
app.use('/', coreRoutes);

// Rota raiz
app.get('/ping', (req, res) => {
  res.send('Pong!');
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
