import type { Request, Response } from 'express';
import type { ExtensionsCreationRequest } from './dtos/ExtensionsCreationRequest.ts';
import type { ExtensionsUpdateRequest } from './dtos/ExtensionsUpdateRequest.ts';
import type { ExtensionsDeleteRequest } from './dtos/ExtensionsDeleteRequest.ts';
import { ProcessExtensionsCreationUseCase } from './../usecases/ProcessExtensionsCreationUseCase';
import { ProcessExtensionsDeleteUseCase } from './../usecases/ProcessExtensionsDeleteUseCase';
import { ProcessExtensionsGetAllUseCase } from '../usecases/ProcessExtensionsGetAllUseCase.ts';
import { ProcessExtensionsUpdateUseCase } from '../usecases/ProcessExtensionsUpdateUseCase.ts';
import { ProcessExtensionsGetByIdUseCase } from '../usecases/ProcessExtensionsGetByIdUseCase.ts';
import { ExtensionMessages } from '../../../shared/constants/messages.ts';

export class ExtensionsController {
    constructor(
      private processExtensionsCreationUseCase: ProcessExtensionsCreationUseCase,
      private processExtensionsDeleteUseCase: ProcessExtensionsDeleteUseCase,
      private processExtensionsGetAllUseCase: ProcessExtensionsGetAllUseCase,
      private processExtensionsUpdateUseCase: ProcessExtensionsUpdateUseCase,
      private processExtensionsGetByIdUseCase: ProcessExtensionsGetByIdUseCase
    ) {}

  /**
   * Processa os dados de criação de ramal via POST
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async create(
    req: Request<unknown, unknown, ExtensionsCreationRequest>,
    res: Response
  ): Promise<void> {
    try {
      const extensions = req.body;
      // TODO: Validar dados recebidos, está faltando o enum de departamento
      // Processa os dados
      const result = await this.processExtensionsCreationUseCase.perform(extensions);

      // Responde com sucesso
      res.status(201).json(result);
    } catch (error) {
      console.error(ExtensionMessages.CREATE_ERROR, error);
      res.status(500).json({
        message: ExtensionMessages.CREATE_ERROR,
      });
    }
  }

  async delete(
    req: Request<ExtensionsDeleteRequest, unknown, unknown>,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Processa os dados
      const result = await this.processExtensionsDeleteUseCase.perform(id);

      // Responde com sucesso
      res.status(204).json(result);
    } catch (error) {
      console.error(ExtensionMessages.DELETE_ERROR, error);
      res.status(500).json({
        message: ExtensionMessages.DELETE_ERROR,
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Processa os dados
      const result = await this.processExtensionsGetAllUseCase.perform();

      // Responde com sucesso
      res.status(200).json(result);
    } catch (error) {
      console.error(ExtensionMessages.GET_ALL_ERROR, error);
      res.status(500).json({
        message: ExtensionMessages.GET_ALL_ERROR,
      });
    }
  }

  async update(
    req: Request<unknown, unknown, ExtensionsUpdateRequest>,
    res: Response
  ): Promise<void> {
    try {
      const extensionData = req.body;
      // TODO: Validar dados recebidos, está faltando o enum de departamento
      // Processa os dados
      const result = await this.processExtensionsUpdateUseCase.perform(extensionData);

      // Responde com sucesso
      res.status(200).json(result);
    } catch (error) {
      console.error(ExtensionMessages.UPDATE_ERROR, error);
      res.status(500).json({
        message: ExtensionMessages.UPDATE_ERROR,
      });
    }
  }

  async getById(
      req: Request<{ id: number }>,
      res: Response
    ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.processExtensionsGetByIdUseCase.perform(id);

      res.status(200).json(result);
    } catch (error) {
      console.error(ExtensionMessages.GET_BY_ID_ERROR, error);
      res.status(500).json({
        message: ExtensionMessages.GET_BY_ID_ERROR,
      });
    }
  }
}
