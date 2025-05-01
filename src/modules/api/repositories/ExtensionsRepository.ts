import { Repository, DataSource } from 'typeorm';
import { Extensions } from '../entities/Extensions';

export class ExtensionsRepository {
    private repository: Repository<Extensions>;

    constructor(private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(Extensions)
    }

    /**
   * Salva um novo registro de ramais no banco de dados
   * @param extensionsData Dados dos ramais a serem salvos
   * @returns O registro salvo
   */
    
    async save(extensionsData: any): Promise<Extensions> {
        const extensions = new Extensions();

        return this.repository.save(extensions);
    }
}