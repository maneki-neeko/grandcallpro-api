import type { ExtensionsRequest } from "../controllers/dtos/ExtensionsRequest";
import { ExtensionsRepository } from "../repositories/ExtensionsRepository";
import { AppDataSource } from "../../../database";
import { Extensions } from "../entities/Extensions";
import type { ExtensionsController } from "../controllers/ExtensionsController";

/**
 * Caso de uso responsável por processar a criação do ramal
 */
export class ProcessExtensionsCreationUseCase {
  private extensionsRepository: ExtensionsRepository;

  constructor() {
    this.extensionsRepository = new ExtensionsRepository(AppDataSource);
  }

  /**
   * Processa os dados da criação do ramal
   * @param data Dados do ramal
   * @returns Dados processados ou mensagem de sucesso
   */
    async perform(data: ExtensionsRequest): Promise<Extensions> {
        return this.extensionsRepository.save(data);
  }
}