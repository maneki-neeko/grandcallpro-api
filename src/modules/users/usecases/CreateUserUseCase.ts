import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../../../database';
import { User } from '../entities/User';
import type { UserCreationRequest } from '../controllers/dtos/UserCreationRequest';

export class CreateUserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  async perform(data: UserCreationRequest): Promise<User> {
    return this.userRepository.save(data);
  }
}
