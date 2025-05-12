/**
 * Interface que representa o objeto de atualização de usuários
 */
export type UserUpdateRequest = {
  id: string;
  name?: string;
  email?: string;
  department?: string;
  password?: string;
  role?: string;
  level?: string;
};
