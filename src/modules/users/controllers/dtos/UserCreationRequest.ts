/**
 * Interface que representa o objeto de criação de usuários
 */
export type UserCreationRequest = {
  name: string;
  email: string;
  departament: string;
  password: string;
  role: string;
  level: string;
};
