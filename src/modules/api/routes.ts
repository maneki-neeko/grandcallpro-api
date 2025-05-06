import { Router } from "express";
import { ExtensionsController } from "./controllers/ExtensionsController";
import { ProcessExtensionsCreationUseCase } from "./usecases/ProcessExtensionsCreationUseCase";
import { ProcessExtensionsDeleteUseCase } from "./usecases/ProcessExtensionsDeleteUseCase";
import { ProcessExtensionsGetAllUseCase } from "./usecases/ProcessExtensionsGetAllUseCase";
import { ProcessExtensionsUpdateUseCase } from "./usecases/ProcessExtensionsUpdateUseCase";

const router = Router();
const BASE_PATH = "/v1/extensions";

const processExtensionsCreationUseCase = new ProcessExtensionsCreationUseCase();
const processExtensionsDeleteUseCase = new ProcessExtensionsDeleteUseCase();
const processExtensionsGetAllUseCase = new ProcessExtensionsGetAllUseCase();
const processExtensionsEditUseCase = new ProcessExtensionsUpdateUseCase();

const extensionsController = new ExtensionsController(
  processExtensionsCreationUseCase,
  processExtensionsDeleteUseCase,
  processExtensionsGetAllUseCase,
  processExtensionsEditUseCase
);

router.post(BASE_PATH, (req, res) => extensionsController.create(req, res));

router.delete(`${BASE_PATH}/:id`, (req, res) =>
  extensionsController.delete(req, res)
);

router.get(BASE_PATH, (req, res) => extensionsController.getAll(req, res));

router.put(BASE_PATH, (req, res) => extensionsController.update(req, res));

export default router;
