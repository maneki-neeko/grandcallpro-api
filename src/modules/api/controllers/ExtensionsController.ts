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
  private processExtensionsCreationUseCase: ProcessExtensionsCreationUseCase;
  private processExtensionsDeleteUseCase: ProcessExtensionsDeleteUseCase;
  private processExtensionsGetAllUseCase: ProcessExtensionsGetAllUseCase;
  private processExtensionsUpdateUseCase: ProcessExtensionsUpdateUseCase;
  private processExtensionsGetByIdUseCase: ProcessExtensionsGetByIdUseCase;

  constructor(
    processExtensionsCreationUseCase: ProcessExtensionsCreationUseCase,
    processExtensionsDeleteUseCase: ProcessExtensionsDeleteUseCase,
    processExtensionsGetAllUseCase: ProcessExtensionsGetAllUseCase,
    processExtensionsUpdateUseCase: ProcessExtensionsUpdateUseCase,
    processExtensionsGetByIdUseCase: ProcessExtensionsGetByIdUseCase
  ) {
    this.processExtensionsCreationUseCase = processExtensionsCreationUseCase;
    this.processExtensionsDeleteUseCase = processExtensionsDeleteUseCase;
    this.processExtensionsGetAllUseCase = processExtensionsGetAllUseCase;
    this.processExtensionsUpdateUseCase = processExtensionsUpdateUseCase;
    this.processExtensionsGetByIdUseCase = processExtensionsGetByIdUseCase;
  }

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

      // Se o ramal não foi encontrado, retorna 404
      if (!result) {
        res.status(404).json({
          message: ExtensionMessages.NOT_FOUND
        });
        return;
      }

      // Responde com sucesso
      res.status(204).json();
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
      const extensions = req.body as ExtensionsUpdateRequest;
      // TODO: Validar dados recebidos, está faltando o enum de departamento
      // Processa os dados
      const result = await this.processExtensionsUpdateUseCase.perform(extensions);

      // Se o ramal não foi encontrado, retorna 404
      if (!result) {
        res.status(404).json({
          message: ExtensionMessages.NOT_FOUND
        });
        return;
      }

      // Busca o ramal atualizado para retornar
      const updatedExtension = await this.processExtensionsGetByIdUseCase.perform(extensions.id);

      // Responde com sucesso
      res.status(200).json(updatedExtension);
    } catch (error) {
      console.error(ExtensionMessages.UPDATE_ERROR, error);
      res.status(500).json({
        message: ExtensionMessages.UPDATE_ERROR,
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as unknown as number;

      const result = await this.processExtensionsGetByIdUseCase.perform(id);

      if (!result) {
        res.status(404).json({
          message: ExtensionMessages.NOT_FOUND
        });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error(ExtensionMessages.GET_BY_ID_ERROR, error);
      res.status(500).json({
        message: ExtensionMessages.GET_BY_ID_ERROR,
      });
    }
  }
}
