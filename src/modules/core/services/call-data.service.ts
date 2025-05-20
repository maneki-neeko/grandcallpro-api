import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CallRecord } from '@core/entities/call-record.entity';
import { UcmCallDataDto } from '@core/dto/ucm-call-data.dto';

@Injectable()
export class CallDataService {
  private readonly logger = new Logger(CallDataService.name);

  constructor(
    @InjectRepository(CallRecord)
    private repository: Repository<CallRecord>,
    private eventEmitter: EventEmitter2
  ) {}

  /**
   * Processa os dados de chamada recebidos
   * @param data Dados da chamada
   * @returns Dados processados ou mensagem de sucesso
   */
  async processCallData(data: UcmCallDataDto): Promise<{ message: string }> {
    try {
      const now = new Date();
      const readableTime = now.toISOString();

      this.logger.log(`[${readableTime}] Received data: ${JSON.stringify(data, null, 2)}`);

      // Converte os dados do DTO para a entidade
      const callRecord = Object.assign(new CallRecord(), {
        ...data,
        duration: parseInt(data.duration, 10),
        billsec: parseInt(data.billsec, 10),
      });

      // Salva os dados no banco de dados
      const savedRecord = await this.repository.save(callRecord);

      // Emite o evento de forma assíncrona
      this.eventEmitter.emit('call.recorded', savedRecord.id);

      return {
        message: `id: ${savedRecord.id} - unique_id: ${savedRecord.uniqueid}`,
      };
    } catch (error) {
      this.logger.error(`Erro ao processar dados de chamada: ${error.message}`, error.stack);
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
      return await this.repository.find({
        skip: offset,
        take: limit,
        order: { id: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Erro ao listar registros de chamada: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Busca registros de chamada por uniqueId
   * @param uniqueId ID único da chamada
   * @returns Registro encontrado ou null
   */
  async findByUniqueId(uniqueId: string): Promise<CallRecord[]> {
    try {
      return await this.repository
        .createQueryBuilder('call_record')
        .where('call_record.uniqueid = :uniqueId', { uniqueId })
        .orderBy(
          "CASE WHEN call_record.end = '' THEN call_record.start ELSE call_record.end END",
          'DESC'
        )
        .getMany();
    } catch (error) {
      this.logger.error(`Erro ao buscar registro por uniqueId: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findLastFiveCalls(): Promise<CallRecord[]> {
    try {
      return await this.repository.find({
        order: { id: 'DESC' },
        take: 5,
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar chamadas: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findTotalCallsOfToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return await this.repository.count({
        where: {
          start: today.toISOString(),
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar chamadas: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findTotalCallsOfYesterday(): Promise<number> {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return await this.repository.count({
        where: {
          start: yesterday.toISOString(),
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar chamadas: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findTotalLostCallsOfToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return await this.repository.count({
        where: {
          start: today.toISOString(),
          disposition: 'NO ANSWER',
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar chamadas: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findTotalLostCallsOfYesterday(): Promise<number> {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return await this.repository.count({
        where: {
          start: yesterday.toISOString(),
          disposition: 'NO ANSWER',
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar chamadas: ${error.message}`, error.stack);
      throw error;
    }
  }
}
