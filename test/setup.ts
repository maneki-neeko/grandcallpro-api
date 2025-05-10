import { DataSource } from 'typeorm';
import { CallRecord } from '../src/modules/core/entities/CallRecord';
import { Extensions } from '../src/modules/api/entities/Extensions';

// Configuração da conexão com o banco de dados SQLite em memória para testes
export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:', // Usa SQLite em memória
  synchronize: true,
  dropSchema: true,
  logging: false,
  entities: [CallRecord, Extensions],
});

// Função para inicializar a conexão com o banco de dados de teste
export const initializeTestDatabase = async (): Promise<DataSource> => {
  try {
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
      console.log('Conexão com o banco de dados em memória inicializada com sucesso');
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
