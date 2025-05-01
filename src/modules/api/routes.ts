import { Router } from "express";
import { ExtensionsController } from "./controllers/ExtensionsController";
import { ProcessExtensionsCreationUseCase } from "./usecases/ProcessExtensionsCreationUseCase";
import { ProcessExtensionsDeleteUseCase } from "./usecases/ProcessExtensionsDeleteUseCase";

const router = Router();

const processExtensionsCreationUseCase = new ProcessExtensionsCreationUseCase();
const processExtensionsDeleteUseCase = new ProcessExtensionsDeleteUseCase();

const extensionsController = new ExtensionsController(
  processExtensionsCreationUseCase,
  processExtensionsDeleteUseCase
);

router.post("/v1/extensions", (req, res) =>
  extensionsController.createExtension(req, res)
);

router.delete("/v1/extensions/:id", (req, res) =>
  extensionsController.deleteExtension(req, res)
);

export default router;
