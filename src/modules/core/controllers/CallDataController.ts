import type { Request, Response } from 'express';
import type { UcmCallData } from './dtos/UcmCallData';
import { ProcessCallDataUseCase } from '../usecases/ProcessCallDataUseCase';

/**
 * Controller responsável por gerenciar as rotas relacionadas aos dados de chamada
 */
export class CallDataController {
  private processCalDataUseCase: ProcessCallDataUseCase;
  
  constructor(processCalDataUseCase: ProcessCallDataUseCase) {
    this.processCalDataUseCase = processCalDataUseCase
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
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao receber dados de chamada:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno ao processar dados de chamada'
      });
    }
  }
}
