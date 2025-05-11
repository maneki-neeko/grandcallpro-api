import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para os dados de chamada recebidos da UCM
 */
export class UcmCallDataDto {
  @IsString()
  @IsNotEmpty()
  AcctId: string;

  @IsString()
  @IsNotEmpty()
  accountcode: string;

  @IsString()
  @IsNotEmpty()
  src: string;

  @IsString()
  @IsNotEmpty()
  dst: string;

  @IsString()
  @IsNotEmpty()
  dcontext: string;

  @IsString()
  @IsNotEmpty()
  clid: string;

  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsString()
  @IsNotEmpty()
  dstchannel: string;

  @IsString()
  @IsNotEmpty()
  lastapp: string;

  @IsString()
  @IsNotEmpty()
  lastdata: string;

  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  end: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  billsec: string;

  @IsString()
  @IsNotEmpty()
  disposition: string;

  @IsString()
  @IsNotEmpty()
  amaflags: string;

  @IsString()
  @IsNotEmpty()
  uniqueid: string;

  @IsString()
  userfield: string;

  @IsString()
  channel_ext: string;

  @IsString()
  dstchannel_ext: string;

  @IsString()
  service: string;

  @IsString()
  caller_name: string;

  @IsString()
  recordfiles: string;

  @IsString()
  dstanswer: string;

  @IsString()
  chanext: string;

  @IsString()
  dstchanext: string;

  @IsString()
  session: string;

  @IsString()
  action_owner: string;

  @IsString()
  action_type: string;

  @IsString()
  src_trunk_name: string;

  @IsString()
  dst_trunk_name: string;

  @IsString()
  sn: string;
}
