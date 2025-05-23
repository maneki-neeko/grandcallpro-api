import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@users/entities/user.entity';
import UserLevel from '@users/entities/user-level';
import supertest from 'supertest';
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

  describe('POST /v1/auth/register', () => {
    it('deve registrar um novo usuário com sucesso e retornar um token', async () => {
      const userData = {
        username: 'userexample',
        name: 'Teste Usuario',
        email: 'teste@example.com',
        department: 'TI',
        password: 'senha123',
        role: 'developer',
        level: UserLevel.USER,
      };

      const response = await supertest(context.httpServer)
        .post('/v1/auth/register')
        .send(userData)
        .expect(201);

      // Verifica se retornou um token
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        user: {
          email: 'teste@example.com',
          id: 1,
          level: UserLevel.USER,
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
      // Cria um usuário primeiro
      const existingUser = userRepository.create({
        name: 'Usuário Existente',
        username: 'userexample',
        email: 'existente@example.com',
        department: 'RH',
        password: await bcrypt.hash('senha123', 10),
        role: 'admin',
        level: UserLevel.ADMIN,
      });
      await userRepository.save(existingUser);

      // Tenta criar outro usuário com o mesmo email
      const userData = {
        name: 'Outro Usuário',
        username: 'userexample',
        email: 'existente@example.com', // mesmo email
        department: 'TI',
        password: 'outrasenha',
        role: 'developer',
        level: UserLevel.USER,
      };

      await supertest(context.httpServer).post('/v1/auth/register').send(userData).expect(409); // Conflict
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

      await supertest(context.httpServer).post('/v1/auth/register').send(invalidData).expect(400);
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
      await supertest(context.httpServer).post('/v1/auth/register').send(userData).expect(400);
    });
  });

  describe('POST /v1/auth/login', () => {
    it('deve autenticar um usuário com sucesso e retornar um token', async () => {
      // Cria um usuário para testar o login
      const password = 'senha123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        name: 'Usuário Teste',
        email: 'login@example.com',
        username: 'login@example.com',
        department: 'TI',
        password: hashedPassword,
        role: 'developer',
        level: UserLevel.USER,
      });
      await userRepository.save(user);

      // Tenta fazer login
      const loginData = {
        login: 'login@example.com',
        password: 'senha123',
      };

      const response = await supertest(context.httpServer)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(200);

      // Verifica se retornou um token
      expect(response.body.accessToken).toBeDefined();
    });

    it('deve autenticar com sucesso usando o username', async () => {
      const password = 'senha123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({
        name: 'Usuário Username',
        email: 'username@example.com',
        username: 'user.name',
        department: 'TI',
        password: hashedPassword,
        role: 'developer',
        level: UserLevel.USER,
      });
      await userRepository.save(user);
      const loginData = { login: 'user.name', password: 'senha123' };
      const response = await supertest(context.httpServer)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('deve autenticar com sucesso usando o email', async () => {
      const password = 'senha123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({
        name: 'Usuário Email',
        email: 'emailuser@example.com',
        username: 'emailuser',
        department: 'TI',
        password: hashedPassword,
        role: 'developer',
        level: UserLevel.USER,
      });
      await userRepository.save(user);
      const loginData = { login: 'emailuser@example.com', password: 'senha123' };
      const response = await supertest(context.httpServer)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('deve retornar erro ao tentar autenticar com campo de login inválido', async () => {
      const loginData = { login: ' ', password: 'senha123' };
      await supertest(context.httpServer).post('/v1/auth/login').send(loginData).expect(400);
    });

    it('deve retornar erro ao tentar autenticar com email inexistente', async () => {
      const loginData = {
        login: 'naoexiste@example.com',
        password: 'senha123',
      };

      await supertest(context.httpServer).post('/v1/auth/login').send(loginData).expect(400);
    });

    it('deve retornar erro ao tentar autenticar com senha incorreta', async () => {
      // Cria um usuário para testar o login
      const user = userRepository.create({
        name: 'Usuário Teste',
        email: 'senha@example.com',
        username: 'senha@example.com',
        department: 'TI',
        password: await bcrypt.hash('senha123', 10),
        role: 'developer',
        level: UserLevel.USER,
      });
      await userRepository.save(user);

      // Tenta fazer login com senha errada
      const loginData = {
        login: 'senha@example.com',
        password: 'senhaerrada',
      };

      await supertest(context.httpServer).post('/v1/auth/login').send(loginData).expect(400);
    });
  });
});
