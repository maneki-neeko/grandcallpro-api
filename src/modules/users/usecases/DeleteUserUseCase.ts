import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../../../database';

export class DeleteUserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  async perform(id: string): Promise<void> {
    const numericId = parseInt(id, 10);
    await this.userRepository.delete(numericId);
  }
}
