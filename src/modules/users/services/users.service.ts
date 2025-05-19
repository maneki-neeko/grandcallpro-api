import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { ILike } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(user: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { name: ILike(user.name) }, { username: user.username }],
    });

    if (existingUser) {
      throw new ConflictException('User with Email, Name, or Login already exists');
    }

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByLogin(login: string): Promise<User> {
    return this.userRepository.findOne({ where: { username: login } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new ConflictException('Login already exists');
      }
    }
    if (updateUserDto.name && updateUserDto.name !== user.name) {
      const existingUser = await this.userRepository.findOne({
        where: { name: ILike(updateUserDto.name) },
      });
      if (existingUser) {
        throw new ConflictException('Name already exists');
      }
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
