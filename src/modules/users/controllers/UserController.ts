import { CreateUserUseCase } from '../usecases/CreateUserUseCase';
import { DeleteUserUseCase } from '../usecases/DeleteUserUseCase';
import { GetAllUsersUseCase } from '../usecases/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../usecases/UpdateUserUseCase';
import { GetUserByIdUseCase } from '../usecases/GetUserByIdUseCase';
import { AuthenticateUserUseCase } from '../usecases/AuthenticateUserUseCase';
import type { Request, Response } from 'express';
import type { UserCreationRequest } from './dtos/UserCreationRequest';
import type { UserUpdateRequest } from './dtos/UserUpdateRequest';
import type { UserDeleteRequest } from './dtos/UserDeleteRequest';
import type { UserAuthenticationRequest } from './dtos/UserAuthenticationRequest';

/**
 * Controlador responsável por gerenciar as requisições relacionadas a usuários
 */
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase
  ) {}

  async create(req: Request<unknown, unknown, UserCreationRequest>, res: Response): Promise<void> {
    try {
      const user = await this.createUserUseCase.perform(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  async delete(req: Request<{ id: string }, unknown, unknown>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.perform(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.perform();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  async update(req: Request<unknown, unknown, UserUpdateRequest>, res: Response): Promise<void> {
    try {
      const userData = req.body;
      await this.updateUserUseCase.perform(userData);
      res.status(200).send();
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  }

  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserByIdUseCase.perform(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  }

  async authenticate(
    req: Request<unknown, unknown, UserAuthenticationRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authenticateUserUseCase.perform(email, password);

      if (!result) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error authenticating user:', error);
      res.status(500).json({ message: 'Error authenticating user' });
    }
  }
}
