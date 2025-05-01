import type { UcmCallData } from '../controllers/dtos/UcmCallData';

/**
 * Serviço responsável por processar os dados de chamada
 */
export class ProcessCallDataUseCase {
  /**
   * Processa os dados de chamada recebidos
   * @param data Dados da chamada
   * @returns Dados processados ou mensagem de sucesso
   */
  async perform(data: UcmCallData): Promise<{ message: string }> {
    try {
      console.log('Dados de chamada recebidos:', data);
      
      return {
        message: `Dados de chamada processados com sucesso. uniqueID: ${data.uniqueid}`
      };
    } catch (error) {
      console.error('Erro ao processar dados de chamada:', error);
      throw error;
    }
  }
}
