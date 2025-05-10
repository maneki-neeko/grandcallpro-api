import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';

/**
 * Repositório para manipulação dos usuários no banco de dados
 */
export class UserRepository {
  private repository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User);
  }

  async save(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getAll(): Promise<User[]> {
    return this.repository.find();
  }

  async getById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, user: Partial<User>): Promise<void> {
    await this.repository.update(id, user);
  }

  async findByName(name: string): Promise<User | null> {
    return this.repository.findOne({ where: { name } });
  }
}
