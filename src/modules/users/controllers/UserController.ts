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
import { UserMessages } from '@users/constants/messages';

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
      console.error(UserMessages.CREATE_ERROR, error);
      res.status(500).json({ message: UserMessages.CREATE_ERROR });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.perform(id);
      res.status(204).send();
    } catch (error) {
      console.error(UserMessages.DELETE_ERROR, error);
      res.status(500).json({ message: UserMessages.DELETE_ERROR });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.perform();
      res.status(200).json(users);
    } catch (error) {
      console.error(UserMessages.GET_ALL_ERROR, error);
      res.status(500).json({ message: UserMessages.GET_ALL_ERROR });
    }
  }

  async update(req: Request<unknown, unknown, UserUpdateRequest>, res: Response): Promise<void> {
    try {
      const userData = req.body;
      await this.updateUserUseCase.perform(userData);
      res.status(200).send();
    } catch (error) {
      console.error(UserMessages.UPDATE_ERROR, error);
      res.status(500).json({ message: UserMessages.UPDATE_ERROR });
    }
  }

  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserByIdUseCase.perform(id);
      if (!user) {
        res.status(404).json({ message: UserMessages.NOT_FOUND });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(UserMessages.GET_BY_ID_ERROR, error);
      res.status(500).json({ message: UserMessages.GET_BY_ID_ERROR });
    }
  }

  async authenticate(
    req: Request<unknown, unknown, UserAuthenticationRequest>,
    res: Response
  ): Promise<void> {
    try {
      const credentials = req.body;
      const result = await this.authenticateUserUseCase.perform(credentials);

      if (!result) {
        res.status(401).json({ message: UserMessages.INVALID_DATA });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error(UserMessages.AUTHENTICATING_ERROR, error);
      res.status(500).json({ message: UserMessages.AUTHENTICATING_ERROR });
    }
  }
}
