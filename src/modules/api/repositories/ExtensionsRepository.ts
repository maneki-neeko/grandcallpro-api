import { Repository, DataSource } from 'typeorm';
import { Extensions } from '../entities/Extensions';
import type { ExtensionsCreationRequest } from '../controllers/dtos/ExtensionsCreationRequest';
import type { ExtensionsUpdateRequest } from '../controllers/dtos/ExtensionsUpdateRequest';

export class ExtensionsRepository {
  private repository: Repository<Extensions>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Extensions);
  }

  /**
   * Salva um novo registro de ramais no banco de dados
   * @param extensionsData Dados dos ramais a serem salvos
   * @returns O registro salvo
   */

  async save(extensionsData: ExtensionsCreationRequest): Promise<Extensions> {
    const extensions = new Extensions();

    extensions.number = extensionsData.number;
    extensions.department = extensionsData.department;
    extensions.sector = extensionsData.sector;
    extensions.employee = extensionsData.employee;

    return this.repository.save(extensions);
  }

  async delete(id: string): Promise<void> {
    this.repository.delete(id);
  }

  async getAll(): Promise<Extensions[]> {
    return this.repository.find();
  }

  async getById(id: number): Promise<Extensions | null> {
    const extension = await this.repository.findOne({ where: { id } });

    if (!extension) return null;

    return extension;
  }

  async update(extensionsData: ExtensionsUpdateRequest): Promise<void> {
    this.repository.update(
      { id: extensionsData.id },
      {
        number: extensionsData.number,
        department: extensionsData.department,
        sector: extensionsData.sector,
        employee: extensionsData.employee,
      }
    );
  }
}
