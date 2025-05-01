import { Router } from 'express';
import { ExtensionsController } from './controllers/ExtensionsController';

const router = Router();

const extensionsController = new ExtensionsController();

router.post('/v1/extensions', (req, res) => extensionsController.createExtension(req, res));

export default router;