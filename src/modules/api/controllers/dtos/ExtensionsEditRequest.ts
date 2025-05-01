/**
 * Interface que representa o objeto de edição dos ramais
 */

export interface ExtensionsUpdateRequest {
  id: number;
  number: number;
  department: string;
  sector: string;
  employee: string;
}
