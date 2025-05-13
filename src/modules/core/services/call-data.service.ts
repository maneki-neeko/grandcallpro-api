import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallRecord } from '@core/entities/call-record.entity';
import { UcmCallDataDto } from '@core/dto/ucm-call-data.dto';

@Injectable()
export class CallDataService {
  private readonly logger = new Logger(CallDataService.name);

  constructor(
    @InjectRepository(CallRecord)
    private repository: Repository<CallRecord>
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
      const callRecord = new CallRecord();
      callRecord.acct_id = data.AcctId;
      callRecord.accountcode = data.accountcode;
      callRecord.src = data.src;
      callRecord.dst = data.dst;
      callRecord.dcontext = data.dcontext;
      callRecord.clid = data.clid;
      callRecord.channel = data.channel;
      callRecord.dstchannel = data.dstchannel;
      callRecord.lastapp = data.lastapp;
      callRecord.lastdata = data.lastdata;
      callRecord.start = data.start;
      callRecord.answer = data.answer;
      callRecord.end = data.end;
      callRecord.duration = parseInt(data.duration, 10);
      callRecord.billsec = parseInt(data.billsec, 10);
      callRecord.disposition = data.disposition;
      callRecord.amaflags = data.amaflags;
      callRecord.uniqueid = data.uniqueid;
      callRecord.userfield = data.userfield;
      callRecord.channel_ext = data.channel_ext;
      callRecord.dstchannel_ext = data.dstchannel_ext;
      callRecord.service = data.service;
      callRecord.caller_name = data.caller_name;
      callRecord.recordfiles = data.recordfiles;
      callRecord.dstanswer = data.dstanswer;
      callRecord.chanext = data.chanext;
      callRecord.dstchanext = data.dstchanext;
      callRecord.session = data.session;
      callRecord.action_owner = data.action_owner;
      callRecord.action_type = data.action_type;
      callRecord.src_trunk_name = data.src_trunk_name;
      callRecord.dst_trunk_name = data.dst_trunk_name;
      callRecord.sn = data.sn;

      // Salva os dados no banco de dados
      const savedRecord = await this.repository.save(callRecord);

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
}
