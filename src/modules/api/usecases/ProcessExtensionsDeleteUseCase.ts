import type { ExtensionsCretionRequest } from "../controllers/dtos/ExtensionsCretionRequest";
import { ExtensionsRepository } from "../repositories/ExtensionsRepository";
import { AppDataSource } from "../../../database";
import { Extensions } from "../entities/Extensions";

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
   * @param data Dados do ramal
   * @returns Dados processados ou mensagem de sucesso
   */
  async perform(id: number): Promise<void> {
    // TO-DO: Validar que usuário tenha permissão para exclusão de ramal
    this.extensionsRepository.delete(id);
  }
}
