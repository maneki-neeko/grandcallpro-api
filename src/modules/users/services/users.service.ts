import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { ILike } from 'typeorm';
import UserLevel from '@users/entities/user-level';
import UserStatus from '@users/entities/user-status';
import * as bcrypt from 'bcrypt';
import { UserDto } from '@users/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createAlreadyActive(user: CreateUserDto): Promise<UserDto> {
    const newUser = Object.assign(new User(), {
      ...user,
      status: UserStatus.ACTIVE,
    });

    return this.create(newUser);
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    await this.validateEmail(user.email, '');
    await this.validateUsername(user.username, '');
    await this.validateName(user.name, '');

    const encryptedPassword = await bcrypt.hash(user.password, 10);

    user.password = encryptedPassword;

    return this.userRepository.save(user).then(user => user.toDto());
  }

  async findAll(): Promise<UserDto[]> {
    return (await this.userRepository.find()).map(user => user.toDto());
  }

  async findAllAdmins(): Promise<UserDto[]> {
    return (await this.userRepository.find({ where: { level: UserLevel.ADMIN } })).map(user =>
      user.toDto()
    );
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user.toDto();
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: [{ username: login }, { email: login }],
    });
  }

  async activeUser(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.activate();

    return this.userRepository.save(user).then(user => user.toDto());
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.findOne(id);
    await this.validateEmail(updateUserDto.email, user.email);
    await this.validateUsername(updateUserDto.username, user.username);
    await this.validateName(updateUserDto.name, user.name);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user).then(user => user.toDto());
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
  }

  private async validateEmail(newEmail: string | undefined, currentEmail: string): Promise<void> {
    if (newEmail && newEmail !== currentEmail) {
      const existingUser = await this.userRepository.findOne({ where: { email: newEmail } });
      if (existingUser) throw new ConflictException('Email already exists');
    }
  }

  private async validateUsername(
    newUsername: string | undefined,
    currentUsername: string
  ): Promise<void> {
    if (newUsername && newUsername !== currentUsername) {
      const existingUser = await this.userRepository.findOne({ where: { username: newUsername } });
      if (existingUser) throw new ConflictException('Username already exists');
    }
  }

  private async validateName(newName: string | undefined, currentName: string): Promise<void> {
    if (newName && newName !== currentName) {
      const existingUser = await this.userRepository.findOne({ where: { name: ILike(newName) } });
      if (existingUser) throw new ConflictException('Name already exists');
    }
  }
}
