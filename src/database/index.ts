import { DataSource } from 'typeorm';
import { CallRecord } from '../modules/core/entities/CallRecord';
import path from 'path';

// Configuração da conexão com o banco de dados SQLite
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(__dirname, '../../database.sqlite'),
  synchronize: true, // Em produção, considere usar migrations em vez de synchronize
  logging: process.env.NODE_ENV === 'development',
  entities: [CallRecord],
});

// Função para inicializar a conexão com o banco de dados
export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection initialized successfully');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }
};
