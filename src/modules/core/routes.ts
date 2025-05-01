import { Router } from 'express';
import { CallDataController } from './controllers/CallDataController';
import { ProcessCallDataUseCase } from './usecases/ProcessCallDataUseCase';

const router = Router();

const processCallDataUseCase = new ProcessCallDataUseCase();

const callDataController = new CallDataController(processCallDataUseCase);

// Rota para receber dados de chamada
router.post('/data', (req, res) => callDataController.receiveCallData(req, res));

// Rota para listar todos os registros de chamada
router.get('/troubleshooting/data', (req, res) => callDataController.listAllCallData(req, res));

// Rota para buscar registros de chamada por uniqueId
router.get('/troubleshooting/data/:uniqueId', (req, res) => callDataController.findCallDataByUniqueId(req, res));

export default router;
