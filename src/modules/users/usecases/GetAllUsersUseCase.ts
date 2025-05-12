import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../../../database';
import { User } from '../entities/User';

export class GetAllUsersUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  async perform(): Promise<User[]> {
    return this.userRepository.getAll();
  }
}
