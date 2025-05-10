import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { CreateUserUseCase } from './usecases/CreateUserUseCase';
import { DeleteUserUseCase } from './usecases/DeleteUserUseCase';
import { GetAllUsersUseCase } from './usecases/GetAllUsersUseCase';
import { UpdateUserUseCase } from './usecases/UpdateUserUseCase';
import { GetUserByIdUseCase } from './usecases/GetUserByIdUseCase';
import { AuthenticateUserUseCase } from './usecases/AuthenticateUserUseCase';

const router = Router();
const BASE_PATH = '/v1/users';

const createUserUseCase = new CreateUserUseCase();
const deleteUserUseCase = new DeleteUserUseCase();
const getAllUsersUseCase = new GetAllUsersUseCase();
const updateUserUseCase = new UpdateUserUseCase();
const getUserByIdUseCase = new GetUserByIdUseCase();
const authenticateUserUseCase = new AuthenticateUserUseCase();

const userController = new UserController(
  createUserUseCase,
  deleteUserUseCase,
  getAllUsersUseCase,
  updateUserUseCase,
  getUserByIdUseCase,
  authenticateUserUseCase
);

router.post(BASE_PATH, (req, res) => userController.create(req, res));
router.delete(`${BASE_PATH}/:id`, (req, res) => userController.delete(req, res));
router.get(BASE_PATH, (req, res) => userController.getAll(req, res));
router.put(`${BASE_PATH}/:id`, (req, res) => userController.update(req, res));
router.get(`${BASE_PATH}/:id`, (req, res) => userController.getById(req, res));
router.post(`${BASE_PATH}/authenticate`, (req, res) => userController.authenticate(req, res));

export default router;
