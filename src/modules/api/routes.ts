import { Router } from "express";
import { ExtensionsController } from "./controllers/ExtensionsController";
import { ProcessExtensionsCreationUseCase } from "./usecases/ProcessExtensionsCreationUseCase";
import { ProcessExtensionsDeleteUseCase } from "./usecases/ProcessExtensionsDeleteUseCase";
import { ProcessExtensionsGetAllUseCase } from "./usecases/ProcessExtensionsGetAllUseCase";

const router = Router();

const processExtensionsCreationUseCase = new ProcessExtensionsCreationUseCase();
const processExtensionsDeleteUseCase = new ProcessExtensionsDeleteUseCase();
const processExtensionsGetAllUseCase = new ProcessExtensionsGetAllUseCase();

const extensionsController = new ExtensionsController(
  processExtensionsCreationUseCase,
  processExtensionsDeleteUseCase,
  processExtensionsGetAllUseCase
);

router.post("/v1/extensions", (req, res) =>
  extensionsController.createExtension(req, res)
);

router.delete("/v1/extensions/:id", (req, res) =>
  extensionsController.deleteExtension(req, res)
);

router.get("/v1/extensions", (req, res) =>
  extensionsController.getAllExtension(req, res)
);

export default router;
