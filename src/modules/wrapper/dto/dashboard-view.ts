export interface ExtensionInfo {
  value: string;
  options?: {
    department: string;
    sector: string;
    employee: string;
  };
}

export enum CallStatus {
  ATENDIDA = 'ATENDIDA',
  NAO_ATENDIDA = 'NÃO ATENDIDA',
}

export interface Status {
  value: CallStatus;
  answered: boolean;
}

export interface Calls {
  status: Status;
  timestamp: string;
  duration: string;
  origin: ExtensionInfo;
  destiny: ExtensionInfo;
}

export interface Card {
  title: string;
  content: string;
  percentualDifference: string;
}

export interface DashboardView {
  cards: Card[];
  calls: Calls[];
}