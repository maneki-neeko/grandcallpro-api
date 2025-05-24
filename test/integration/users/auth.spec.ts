import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@users/entities/user.entity';
import UserLevel from '@users/entities/user-level';
import request from 'supertest';
import UserStatus from '@users/entities/user-status';
import { cleanupTestingModule, clearDatabase, createTestingModule, TestContext } from 'test/setup';

describe('Auth Controller (e2e)', () => {
  let context: TestContext;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    context = await createTestingModule();
    userRepository = context.dataSource.getRepository(User);
  });

  afterAll(async () => {
    await cleanupTestingModule(context);
  });

  beforeEach(async () => {
    await clearDatabase(context.dataSource);
  });

  const createUser = async () => {
    const user = Object.assign(new User(), {
      name: 'Usuário Teste',
      email: 'teste@example.com',
      username: 'teste',
      department: 'TI',
      password: await bcrypt.hash('senha123', 10),
      role: 'developer',
      level: UserLevel.USER,
      status: UserStatus.ACTIVE,
    });

    await userRepository.save(user);
    return user;
  };

  describe('POST /v1/auth/register', () => {
    it('deve registrar um novo usuário com sucesso e não retornar um token', async () => {
      const userData = {
        username: 'userexample',
        name: 'Teste Usuario',
        email: 'teste@example.com',
        department: 'TI',
        password: 'senha123',
        role: 'developer',
        level: UserLevel.USER,
      };

      const response = await request(context.httpServer)
        .post('/v1/auth/register')
        .send(userData)
        .expect(201);

      // Verifica se retornou um token
      expect(response.body).toMatchObject({
        user: {
          email: 'teste@example.com',
          id: 1,
          level: UserLevel.USER,
          status: UserStatus.PENDING,
          name: 'Teste Usuario',
        },
      });

      // Verifica se o usuário foi salvo no banco
      const savedUser = await userRepository.findOne({
        where: { email: userData.email },
      });
      expect(savedUser).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.department).toBe(userData.department);

      // Verifica se a senha foi hasheada
      const isPasswordValid = await bcrypt.compare(userData.password, savedUser.password);
      expect(isPasswordValid).toBe(true);
    });

    it('deve retornar erro ao tentar registrar com email já existente', async () => {
      const existingUser = await createUser();

      const userData = {
        name: 'Outro Usuário',
        username: 'userexample',
        email: existingUser.email,
        department: 'TI',
        password: 'outrasenha',
        role: 'developer',
        level: UserLevel.USER,
      };

      await request(context.httpServer).post('/v1/auth/register').send(userData).expect(409); // Conflict
    });

    it('deve retornar erro ao tentar registrar com dados inválidos', async () => {
      const invalidData = {
        name: 'Teste',
        username: 'userexample',
        email: 'email-invalido', // email inválido
        department: 'TI',
        password: '123', // senha muito curta
        role: 'developer',
        level: UserLevel.USER,
      };

      await request(context.httpServer).post('/v1/auth/register').send(invalidData).expect(400);
    });

    it('deve retornar erro de validação ao tentar registrar username com espaço', async () => {
      const userData = {
        username: 'user name',
        name: 'Usuário Espaço',
        email: 'espaco@example.com',
        department: 'TI',
        password: 'senha123',
        role: 'developer',
        level: UserLevel.USER,
      };
      await request(context.httpServer).post('/v1/auth/register').send(userData).expect(400);
    });
  });

  describe('POST /v1/auth/login', () => {
    it('deve autenticar um usuário com sucesso e retornar um token', async () => {
      const user = await createUser();

      const loginData = {
        login: user.email,
        password: 'senha123',
      };

      const response = await request(context.httpServer)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(200);

      // Verifica se retornou um token
      expect(response.body.accessToken).toBeDefined();
    });

    it('deve autenticar um usuário sem token caso não seja ativo', async () => {
      const user = {
        name: 'Usuário Teste',
        email: 'teste@example.com',
        username: 'teste',
        department: 'TI',
        password: await bcrypt.hash('senha123', 10),
        role: 'developer',
        level: UserLevel.USER,
        status: UserStatus.PENDING,
      };

      await userRepository.save(user);

      const loginData = {
        login: user.email,
        password: 'senha123',
      };

      const response = await request(context.httpServer)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.accessToken).toBeNull();
    });

    it('deve autenticar com sucesso usando o username', async () => {
      const user = await createUser();
      const loginData = { login: user.username, password: 'senha123' };

      const response = await request(context.httpServer)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
    });

    it('deve autenticar com sucesso usando o email', async () => {
      const user = await createUser();

      const loginData = { login: user.email, password: 'senha123' };
      const response = await request(context.httpServer)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('deve retornar erro ao tentar autenticar com campo de login inválido', async () => {
      const loginData = { login: ' ', password: 'senha123' };
      await request(context.httpServer).post('/v1/auth/login').send(loginData).expect(400);
    });

    it('deve retornar erro ao tentar autenticar com email inexistente', async () => {
      const loginData = {
        login: 'naoexiste@example.com',
        password: 'senha123',
      };

      await request(context.httpServer).post('/v1/auth/login').send(loginData).expect(400);
    });

    it('deve retornar erro ao tentar autenticar com senha incorreta', async () => {
      const user = await createUser();

      const loginData = {
        login: user.email,
        password: 'senhaerrada',
      };

      await request(context.httpServer).post('/v1/auth/login').send(loginData).expect(400);
    });
  });
});
