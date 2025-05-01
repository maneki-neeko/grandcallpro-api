import type { Request, Response } from "express";
import type { ExtensionsRequest } from "./dtos/ExtensionsRequest";
import { ProcessExtensionsCreationUseCase } from "./../usecases/ProcessExtensionsCreationUseCase";

export class ExtensionsController {
  private processExtensionsCreationUseCase: ProcessExtensionsCreationUseCase;

  constructor(
    processExtensionsCreationUseCase: ProcessExtensionsCreationUseCase
  ) {
    this.processExtensionsCreationUseCase = processExtensionsCreationUseCase;
  }

  /**
   * Processa os dados de criação de ramal via POST
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async createExtension(req: Request, res: Response): Promise<void> {
    try {
      const extensions = req.body as ExtensionsRequest;

      // Processa os dados
      const result = await this.processExtensionsCreationUseCase.perform(
        extensions
      );

      // Responde com sucesso
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating extension:", error);
      res.status(500).json({
        message: "Error creating extension",
      });
    }
  }
}
