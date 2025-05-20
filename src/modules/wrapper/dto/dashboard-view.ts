export interface ExtensionInfo {
  value: string;
  options?: {
    department: string;
    sector: string;
    subsector: string;
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

export interface DashboardView {
  calls: Calls[];
}