/**
 * Interface que representa o objeto de criação de usuários
 */
export type UserCreationRequest = {
  name: string;
  email: string;
  department: string;
  password: string;
  role: string;
  level: string;
};
