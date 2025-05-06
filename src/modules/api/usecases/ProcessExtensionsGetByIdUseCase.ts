import { ExtensionsRepository } from "../repositories/ExtensionsRepository";
import { AppDataSource } from "../../../database";
import { Extensions } from "../entities/Extensions";

/**
 * Caso de uso responsável por processar os dados de um ramal
 */
export class ProcessExtensionsGetByIdUseCase {
  private extensionsRepository: ExtensionsRepository;

  constructor() {
    this.extensionsRepository = new ExtensionsRepository(AppDataSource);
  }

  /**
   * Processa os dados de um ramal específico
   * @param data Dados do ramal
   * @returns Dados processados ou mensagem de sucesso
   */
  async perform(id: number): Promise<Extensions | null> {
    return this.extensionsRepository.getById(id);
  }
}
