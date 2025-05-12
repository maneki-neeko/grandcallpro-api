import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../../../database';
import type { UserUpdateRequest } from '../controllers/dtos/UserUpdateRequest';

export class UpdateUserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  async perform(data: UserUpdateRequest): Promise<void> {
    const { id, ...updateData } = data;
    const numericId = parseInt(id, 10);
    await this.userRepository.update(numericId, updateData);
  }
}
