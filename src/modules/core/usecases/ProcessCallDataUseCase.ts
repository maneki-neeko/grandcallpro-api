import type { UcmCallData } from '../controllers/dtos/UcmCallData';
import { CallRecordRepository } from '../repositories/CallRecordRepository';
import { AppDataSource } from '../../../database';
import { CallRecord } from '../entities/CallRecord';

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
      
      // Nota: Não verificamos duplicação de uniqueid, pois este pode se repetir
      
      // Salva os dados no banco de dados
      const savedRecord = await this.callRecordRepository.save(data);
      
      return {
        message: `id: ${savedRecord.id} - unique_id: ${savedRecord.uniqueid}`
      };
    } catch (error) {
      console.error('Erro ao processar dados de chamada:', error);
      throw error;
    }
  }

  /**
   * Lista todos os registros de chamada
   * @param limit Limite de registros a serem retornados
   * @param offset Offset para paginação
   * @returns Lista de registros
   */
  async findAll(limit = 100, offset = 0): Promise<CallRecord[]> {
    try {
      return await this.callRecordRepository.findAll(limit, offset);
    } catch (error) {
      console.error('Erro ao listar registros de chamada:', error);
      throw error;
    }
  }

  /**
   * Busca registros de chamada pelo uniqueid
   * @param uniqueId ID único da chamada
   * @returns Lista de registros com o mesmo uniqueid
   */
  async findByUniqueId(uniqueId: string): Promise<CallRecord[]> {
    try {
      return await this.callRecordRepository.findByUniqueId(uniqueId);
    } catch (error) {
      console.error(`Erro ao buscar registros de chamada com uniqueId ${uniqueId}:`, error);
      throw error;
    }
  }
}
