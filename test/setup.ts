import { DataSource } from 'typeorm';
import { CallRecord } from '../src/modules/core/entities/CallRecord';
import { Extensions } from '../src/modules/api/entities/Extensions';
import path from 'path';
import fs from 'fs';

// Caminho para o arquivo de banco de dados de teste
const testDbPath = path.resolve(__dirname, './test_database.db');

// Configuração da conexão com o banco de dados SQLite para testes
export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: testDbPath,
  synchronize: true,
  dropSchema: true, // Limpa o banco a cada execução de teste
  logging: false,
  entities: [CallRecord, Extensions],
});

// Função para inicializar a conexão com o banco de dados de teste
export const initializeTestDatabase = async (): Promise<DataSource> => {
  try {
    // Remover o banco de teste se já existir
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
      console.log('Conexão com o banco de dados de teste inicializada com sucesso');
    }
    return TestDataSource;
  } catch (error) {
    console.error('Erro ao inicializar a conexão com o banco de dados de teste:', error);
    throw error;
  }
};

// Função para fechar a conexão com o banco de dados de teste
export const closeTestDatabase = async (): Promise<void> => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
    console.log('Conexão com o banco de dados de teste fechada com sucesso');
  }
};
