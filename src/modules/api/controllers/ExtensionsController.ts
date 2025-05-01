import type { Request, Response } from "express";
import type { ExtensionsRequest } from "./dtos/ExtensionsRequest";
import { ProcessExtensionsCreationUseCase } from "./../usecases/ProcessExtensionsCreationUseCase";
import { ProcessExtensionsDeleteUseCase } from "./../usecases/ProcessExtensionsDeleteUseCase";

export class ExtensionsController {
  private processExtensionsCreationUseCase: ProcessExtensionsCreationUseCase;
  private processExtensionsDeleteUseCase: ProcessExtensionsDeleteUseCase;

  constructor(
    processExtensionsCreationUseCase: ProcessExtensionsCreationUseCase,
    processExtensionsDeleteUseCase: ProcessExtensionsDeleteUseCase
  ) {
    this.processExtensionsCreationUseCase = processExtensionsCreationUseCase;
    this.processExtensionsDeleteUseCase = processExtensionsDeleteUseCase;
  }

  /**
   * Processa os dados de criação de ramal via POST
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async createExtension(req: Request, res: Response): Promise<void> {
    try {
      const extensions = req.body as ExtensionsRequest;

      // TODO: Validar dados recebidos, está faltando o enum de departamento

      // Processa os dados
      const result = await this.processExtensionsCreationUseCase.perform(extensions);

      // Responde com sucesso
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating extension:", error);
      res.status(500).json({
        message: "Error creating extension",
      });
    }
  }

  async deleteExtension(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as unknown as number;

      // Processa os dados
      const result = await this.processExtensionsDeleteUseCase.perform(id);

      // Responde com sucesso
      res.status(204).json(result);
    } catch (error) {
      console.error("Error delete extension:", error);
      res.status(500).json({
        message: "Error delete extension",
      });
    }
  }
}
