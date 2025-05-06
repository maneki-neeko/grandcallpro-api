import { Router } from "express";
import { ExtensionsController } from "./controllers/ExtensionsController";
import { ProcessExtensionsCreationUseCase } from "./usecases/ProcessExtensionsCreationUseCase";
import { ProcessExtensionsDeleteUseCase } from "./usecases/ProcessExtensionsDeleteUseCase";
import { ProcessExtensionsGetAllUseCase } from "./usecases/ProcessExtensionsGetAllUseCase";
import { ProcessExtensionsUpdateUseCase } from "./usecases/ProcessExtensionsUpdateUseCase";
import { ProcessExtensionsGetByIdUseCase } from './usecases/ProcessExtensionsGetByIdUseCase';

const router = Router();

const processExtensionsCreationUseCase = new ProcessExtensionsCreationUseCase();
const processExtensionsDeleteUseCase = new ProcessExtensionsDeleteUseCase();
const processExtensionsGetAllUseCase = new ProcessExtensionsGetAllUseCase();
const processExtensionsEditUseCase = new ProcessExtensionsUpdateUseCase();
const processExtensionsGetByIdUseCase = new ProcessExtensionsGetByIdUseCase();

const extensionsController = new ExtensionsController(
  processExtensionsCreationUseCase,
  processExtensionsDeleteUseCase,
  processExtensionsGetAllUseCase,
  processExtensionsEditUseCase,
  processExtensionsGetByIdUseCase
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

router.get("/v1/extensions/:id", (req, res) => {
  extensionsController.getById(req, res)
});

router.put("/v1/extensions", (req, res) =>
  extensionsController.editExtension(req, res)
);

export default router;
