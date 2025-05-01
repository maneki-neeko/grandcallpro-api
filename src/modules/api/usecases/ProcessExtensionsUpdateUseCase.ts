import { ExtensionsRepository } from "../repositories/ExtensionsRepository";
import { AppDataSource } from "../../../database";
import type { ExtensionsUpdateRequest } from "../controllers/dtos/ExtensionsEditRequest";

/**
 * Caso de uso responsável por processar a edição do ramal
 */
export class ProcessExtensionsUpdateUseCase {
  private extensionsRepository: ExtensionsRepository;

  constructor() {
    this.extensionsRepository = new ExtensionsRepository(AppDataSource);
  }

  /**
   * Processa os dados da edição do ramal
   * @param data Dados do ramal
   * @returns Dados processados ou mensagem de sucesso
   */
  async perform(data: ExtensionsUpdateRequest): Promise<void> {
    this.extensionsRepository.update(data);
  }
}
