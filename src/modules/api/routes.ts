import { Router } from "express";
import { ExtensionsController } from "./controllers/ExtensionsController";
import { ProcessExtensionsCreationUseCase } from "./usecases/ProcessExtensionsCreationUseCase";

const router = Router();

const processExtensionsCreationUseCase = new ProcessExtensionsCreationUseCase();

const extensionsController = new ExtensionsController(
  processExtensionsCreationUseCase
);

router.post("/v1/extensions", (req, res) =>
  extensionsController.createExtension(req, res)
);

export default router;
