import { Router } from 'express';
import { CallDataController } from './controllers/CallDataController';
import { ProcessCallDataUseCase } from './usecases/ProcessCallDataUseCase';

const router = Router();

const processCallDataUseCase = new ProcessCallDataUseCase();

const callDataController = new CallDataController(processCallDataUseCase);

// Rota para receber dados de chamada
router.post('/data', (req, res) => callDataController.receiveCallData(req, res));

export default router;
