import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';

/**
 * Entidade que representa um registro de chamada no banco de dados
 */
@Entity('call_records')
export class CallRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  acct_id!: string;

  @Column({ nullable: true })
  accountcode!: string;

  @Column({ nullable: true })
  src!: string;

  @Column({ nullable: true })
  dst!: string;

  @Column({ nullable: true })
  dcontext!: string;

  @Column({ nullable: true })
  clid!: string;

  @Column({ nullable: true })
  channel!: string;

  @Column({ nullable: true })
  dstchannel!: string;

  @Column({ nullable: true })
  lastapp!: string;

  @Column({ nullable: true })
  lastdata!: string;

  @Column({ nullable: true })
  start!: string;

  @Column({ nullable: true })
  answer!: string;

  @Column({ nullable: true })
  end!: string;

  @Column({ type: 'integer', nullable: true })
  duration!: number;

  @Column({ type: 'integer', nullable: true })
  billsec!: number;

  @Column({ nullable: true })
  disposition!: string;

  @Column({ nullable: true })
  amaflags!: string;

  @Column({ nullable: true })
  uniqueid!: string;

  @Column({ nullable: true })
  userfield!: string;

  @Column({ nullable: true })
  channel_ext!: string;

  @Column({ nullable: true })
  dstchannel_ext!: string;

  @Column({ nullable: true })
  service!: string;

  @Column({ nullable: true })
  caller_name!: string;

  @Column({ nullable: true })
  recordfiles!: string;

  @Column({ nullable: true })
  dstanswer!: string;

  @Column({ nullable: true })
  chanext!: string;

  @Column({ nullable: true })
  dstchanext!: string;

  @Column({ nullable: true })
  session!: string;

  @Column({ nullable: true })
  action_owner!: string;

  @Column({ nullable: true })
  action_type!: string;

  @Column({ nullable: true })
  src_trunk_name!: string;

  @Column({ nullable: true })
  dst_trunk_name!: string;

  @Column({ nullable: true })
  sn!: string;
}
