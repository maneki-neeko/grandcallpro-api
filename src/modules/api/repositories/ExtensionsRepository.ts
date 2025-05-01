import { Repository, DataSource } from "typeorm";
import { Extensions } from "../entities/Extensions";
import type { ExtensionsRequest } from "../controllers/dtos/ExtensionsRequest";

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

  async save(extensionsData: ExtensionsRequest): Promise<Extensions> {
    const extensions = new Extensions();

    extensions.number = extensionsData.number;
    extensions.department = extensionsData.departament;
    extensions.sector = extensionsData.sector;
    extensions.employee = extensionsData.employee;

    return this.repository.save(extensions);
  }
}