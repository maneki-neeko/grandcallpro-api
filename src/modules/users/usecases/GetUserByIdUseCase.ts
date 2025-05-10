import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../../../database';
import { User } from '../entities/User';

export class GetUserByIdUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  async perform(id: string): Promise<User | null> {
    const numericId = parseInt(id, 10);
    return this.userRepository.getById(numericId);
  }
}
