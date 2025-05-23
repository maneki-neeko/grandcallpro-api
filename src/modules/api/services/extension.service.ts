import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Extension } from '@api/entities/extension.entity';
import { CreateExtensionDto } from '@api/dto/create-extension.dto';
import { UpdateExtensionDto } from '@api/dto/update-extension.dto';

@Injectable()
export class ExtensionService {
  constructor(
    @InjectRepository(Extension)
    private readonly extensionRepository: Repository<Extension>
  ) {}

  async create(createExtensionDto: CreateExtensionDto): Promise<Extension> {
    const extension = await this.extensionRepository.findOne({
      where: { number: createExtensionDto.number },
    });

    if (extension) {
      throw new ConflictException('Extension already exists');
    }

    return this.extensionRepository.save(createExtensionDto);
  }

  async findAll(): Promise<Extension[]> {
    return this.extensionRepository.find();
  }

  async findOne(id: number): Promise<Extension> {
    const extension = await this.extensionRepository.findOne({ where: { id } });

    if (!extension) {
      throw new NotFoundException(`Extension with ID ${id} not found`);
    }

    return extension;
  }

  async findByNumbers(numbers: number[]): Promise<Extension[]> {
    return this.extensionRepository.find({ where: { number: In(numbers) } });
  }

  async update(updateExtensionDto: UpdateExtensionDto): Promise<Extension> {
    const extension = await this.extensionRepository.findOne({
      where: { id: updateExtensionDto.id },
    });

    if (!extension) {
      throw new NotFoundException(`Extension with ID ${updateExtensionDto.id} not found`);
    }

    await this.extensionRepository.save(updateExtensionDto);
    return this.findOne(updateExtensionDto.id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.extensionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Extension with ID ${id} not found`);
    }
  }
}
