import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';

/**
 * Entidade que representa um registro de chamada no banco de dados
 */
@Entity('call_records')
export class CallRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  AcctId!: string;

  @Column()
  accountcode!: string;

  @Column()
  src!: string;

  @Column()
  dst!: string;

  @Column()
  dcontext!: string;

  @Column()
  clid!: string;

  @Column()
  channel!: string;

  @Column()
  dstchannel!: string;

  @Column()
  lastapp!: string;

  @Column()
  lastdata!: string;

  @Column()
  start!: string;

  @Column()
  answer!: string;

  @Column()
  end!: string;

  @Column({ type: 'integer' })
  duration!: number;

  @Column({ type: 'integer' })
  billsec!: number;

  @Column()
  disposition!: string;

  @Column()
  amaflags!: string;

  @Column()
  uniqueid!: string;

  @Column()
  userfield!: string;

  @Column()
  channel_ext!: string;

  @Column()
  dstchannel_ext!: string;

  @Column()
  service!: string;

  @Column()
  caller_name!: string;

  @Column()
  recordfiles!: string;

  @Column()
  dstanswer!: string;

  @Column()
  chanext!: string;

  @Column()
  dstchanext!: string;

  @Column()
  session!: string;

  @Column()
  action_owner!: string;

  @Column()
  action_type!: string;

  @Column()
  src_trunk_name!: string;

  @Column()
  dst_trunk_name!: string;

  @Column()
  sn!: string;
}
