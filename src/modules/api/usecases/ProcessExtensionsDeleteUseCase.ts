import type { ExtensionsCreationRequest } from '../controllers/dtos/ExtensionsCreationRequest';
import { ExtensionsRepository } from '../repositories/ExtensionsRepository';
import { AppDataSource } from '../../../database';
import { Extensions } from '../entities/Extensions';

/**
 * Caso de uso responsável por processar a exclusão do ramal
 */
export class ProcessExtensionsDeleteUseCase {
  private extensionsRepository: ExtensionsRepository;

  constructor() {
    this.extensionsRepository = new ExtensionsRepository(AppDataSource);
  }

  /**
   * Processa os dados da exclusão do ramal
   * @param id ID do ramal a ser excluído
   * @returns true se o ramal foi encontrado e excluído, false se não foi encontrado
   */
  async perform(id: string): Promise<boolean> {
    // TO-DO: Validar que usuário tenha permissão para exclusão de ramal
    const extension = await this.extensionsRepository.getById(Number(id));

    if (!extension) {
      return false;
    }

    await this.extensionsRepository.delete(id);
    return true;
  }
}
