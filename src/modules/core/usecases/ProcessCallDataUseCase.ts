import type { UcmCallData } from '../controllers/dtos/UcmCallData';
import { CallRecordRepository } from '../repositories/CallRecordRepository';
import { AppDataSource } from '../../../database';

/**
 * Caso de uso responsável por processar os dados de chamada
 */
export class ProcessCallDataUseCase {
  private callRecordRepository: CallRecordRepository;

  constructor() {
    this.callRecordRepository = new CallRecordRepository(AppDataSource);
  }

  /**
   * Processa os dados de chamada recebidos
   * @param data Dados da chamada
   * @returns Dados processados ou mensagem de sucesso
   */
  async perform(data: UcmCallData): Promise<{ message: string }> {
    try {
      console.log('Dados de chamada recebidos:', data);
    

      const savedRecord = await this.callRecordRepository.save(data);
      
      return {
        message: `
        Dados de chamada processados e salvos com sucesso.
        ID: ${savedRecord.id}
        uniqueID: ${savedRecord.uniqueid}`
      };
    } catch (error) {
      console.error('Erro ao processar dados de chamada:', error);
      throw error;
    }
  }
}
