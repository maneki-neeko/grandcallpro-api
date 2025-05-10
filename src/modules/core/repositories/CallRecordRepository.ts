import { Repository, DataSource } from 'typeorm';
import { CallRecord } from '../entities/CallRecord';
import type { UcmCallData } from '../controllers/dtos/UcmCallData';

/**
 * Repositório para manipulação dos registros de chamada no banco de dados
 */
export class CallRecordRepository {
  private repository: Repository<CallRecord>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(CallRecord);
  }

  /**
   * Salva um novo registro de chamada no banco de dados
   * @param callData Dados da chamada a serem salvos
   * @returns O registro salvo
   */
  async save(callData: UcmCallData): Promise<CallRecord> {
    const callRecord = new CallRecord();

    callRecord.acct_id = callData.AcctId;
    callRecord.accountcode = callData.accountcode;
    callRecord.src = callData.src;
    callRecord.dst = callData.dst;
    callRecord.dcontext = callData.dcontext;
    callRecord.clid = callData.clid;
    callRecord.channel = callData.channel;
    callRecord.dstchannel = callData.dstchannel;
    callRecord.lastapp = callData.lastapp;
    callRecord.lastdata = callData.lastdata;
    callRecord.start = callData.start;
    callRecord.answer = callData.answer;
    callRecord.end = callData.end;
    callRecord.duration = parseInt(callData.duration, 10) || 0;
    callRecord.billsec = parseInt(callData.billsec, 10) || 0;
    callRecord.disposition = callData.disposition;
    callRecord.amaflags = callData.amaflags;
    callRecord.uniqueid = callData.uniqueid;
    callRecord.userfield = callData.userfield;
    callRecord.channel_ext = callData.channel_ext;
    callRecord.dstchannel_ext = callData.dstchannel_ext;
    callRecord.service = callData.service;
    callRecord.caller_name = callData.caller_name;
    callRecord.recordfiles = callData.recordfiles;
    callRecord.dstanswer = callData.dstanswer;
    callRecord.chanext = callData.chanext;
    callRecord.dstchanext = callData.dstchanext;
    callRecord.session = callData.session;
    callRecord.action_owner = callData.action_owner;
    callRecord.action_type = callData.action_type;
    callRecord.src_trunk_name = callData.src_trunk_name;
    callRecord.dst_trunk_name = callData.dst_trunk_name;
    callRecord.sn = callData.sn;

    return this.repository.save(callRecord);
  }

  /**
   * Busca registros de chamada pelo uniqueid
   * @param uniqueId ID único da chamada
   * @returns Lista de registros com o mesmo uniqueid, ordenados pelo tempo mais recente
   */
  async findByUniqueId(uniqueId: string): Promise<CallRecord[]> {
    return this.repository
      .createQueryBuilder('call_record')
      .where('call_record.uniqueid = :uniqueId', { uniqueId })
      .orderBy(
        "CASE WHEN call_record.end = '' THEN call_record.start ELSE call_record.end END",
        'DESC'
      )
      .getMany();
  }

  /**
   * Lista todos os registros de chamada
   * @param limit Limite de registros a serem retornados
   * @param offset Offset para paginação
   * @returns Lista de registros ordenados pelo tempo mais recente
   */
  async findAll(limit = 100, offset = 0): Promise<CallRecord[]> {
    return this.repository
      .createQueryBuilder('call_record')
      .orderBy(
        "CASE WHEN call_record.end = '' THEN call_record.start ELSE call_record.end END",
        'DESC'
      )
      .skip(offset)
      .take(limit)
      .getMany();
  }
}
