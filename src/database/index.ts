import { DataSource } from 'typeorm';
import { CallRecord } from '../modules/core/entities/CallRecord';
import path from 'path';
import fs from 'fs';
import { Extensions } from '../modules/api/entities/Extensions';

// Caminho para o arquivo de banco de dados existente
const dbPath = path.resolve(__dirname, './call_records.db');

// Configuração da conexão com o banco de dados SQLite
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [CallRecord, Extensions],
});

// Função para inicializar a conexão com o banco de dados
export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    // Verifica se o arquivo de banco de dados existe
    if (!fs.existsSync(dbPath)) {
      console.warn(`Arquivo de banco de dados não encontrado em: ${dbPath}`);
      console.warn(
        'Certifique-se de que o arquivo de banco de dados existe antes de iniciar a aplicação.'
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conexão com o banco de dados inicializada com sucesso');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Erro ao inicializar a conexão com o banco de dados:', error);
    throw error;
  }
};
