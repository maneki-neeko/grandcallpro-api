import type { ExtensionsCreationRequest } from "../controllers/dtos/ExtensionsCreationRequest";
import { ExtensionsRepository } from "../repositories/ExtensionsRepository";
import { AppDataSource } from "../../../database";
import { Extensions } from "../entities/Extensions";

/**
 * Caso de uso responsável por processar a exclusão do ramal
 */
export class ProcessExtensionsGetAllUseCase {
  private extensionsRepository: ExtensionsRepository;

  constructor() {
    this.extensionsRepository = new ExtensionsRepository(AppDataSource);
  }

  /**
   * Processa os dados da listagem de todos os ramais
   * @param data Dados do ramal
   * @returns Dados processados ou mensagem de sucesso
   */
  async perform(): Promise<Extensions[]> {
    return this.extensionsRepository.getAll();
  }
}
