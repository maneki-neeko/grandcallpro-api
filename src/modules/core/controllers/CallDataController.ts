import type { Request, Response } from "express";
import type { UcmCallData } from "./dtos/UcmCallData";
import { ProcessCallDataUseCase } from "../usecases/ProcessCallDataUseCase";

/**
 * Controller responsável por gerenciar as rotas relacionadas aos dados de chamada
 */
export class CallDataController {
  private processCalDataUseCase: ProcessCallDataUseCase;

  constructor(processCalDataUseCase: ProcessCallDataUseCase) {
    this.processCalDataUseCase = processCalDataUseCase;
  }

  /**
   * Processa os dados de chamada recebidos via POST
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async receiveCallData(req: Request, res: Response): Promise<void> {
    try {
      const callData = req.body as UcmCallData;

      // Processa os dados
      const result = await this.processCalDataUseCase.perform(callData);

      // Responde com sucesso
      res.status(201).json(result);
    } catch (error) {
      console.error("Error receiving call data:", error);
      res.status(500).json({
        message: "Internal error processing call data",
      });
    }
  }

  /**
   * Lista todos os registros de chamada
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async listAllCallData(req: Request, res: Response): Promise<void> {
    try {
      // Extrai parâmetros de paginação da query string
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 100;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;

      // Busca os registros
      const records = await this.processCalDataUseCase.findAll(limit, offset);

      // Responde com os registros encontrados
      res.status(200).json({
        count: records.length,
        data: records,
      });
    } catch (error) {
      console.error("Erro ao listar registros de chamada:", error);
      res.status(500).json({
        message: "Erro interno ao listar registros de chamada",
      });
    }
  }

  /**
   * Busca registros de chamada pelo uniqueid
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async findCallDataByUniqueId(req: Request, res: Response): Promise<void> {
    try {
      // Extrai o uniqueid dos parâmetros da rota
      const uniqueId = req.params.uniqueId;

      if (!uniqueId) {
        res.status(400).json({
          success: false,
          message: "Parâmetro uniqueId é obrigatório",
        });
        return;
      }

      // Busca os registros pelo uniqueid
      const records = await this.processCalDataUseCase.findByUniqueId(uniqueId);

      // Responde com os registros encontrados
      res.status(200).json({
        count: records.length,
        data: records,
      });
    } catch (error) {
      console.error("Erro ao buscar registros de chamada por uniqueId:", error);
      res.status(500).json({
        message: "Erro interno ao buscar registros de chamada",
      });
    }
  }
}
