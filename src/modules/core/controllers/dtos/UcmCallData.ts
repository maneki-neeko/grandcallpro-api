/**
 * Interface que representa os dados de chamada recebidos da UCM
 */
export interface UcmCallData {
    AcctId: string;
    accountcode: string;
    src: string;
    dst: string;
    dcontext: string;
    clid: string;
    channel: string;
    dstchannel: string;
    lastapp: string;
    lastdata: string;
    start: string;
    answer: string;
    end: string;
    duration: string;
    billsec: string;
    disposition: string;
    amaflags: string;
    uniqueid: string;
    userfield: string;
    channel_ext: string;
    dstchannel_ext: string;
    service: string;
    caller_name: string;
    recordfiles: string;
    dstanswer: string;
    chanext: string;
    dstchanext: string;
    session: string;
    action_owner: string;
    action_type: string;
    src_trunk_name: string;
    dst_trunk_name: string;
    sn: string;
  }
  