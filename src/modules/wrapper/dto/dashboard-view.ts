export interface ExtensionInfo {
  value: string;
  options?: {
    department: string;
    sector: string;
    employee: string;
  };
}

export interface Calls {
  status: 'ATENDIDA' | 'NÃO ATENDIDA';
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