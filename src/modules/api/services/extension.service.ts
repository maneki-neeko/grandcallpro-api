import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Extension } from '../entities/extension.entity';
import { CreateExtensionDto } from '../dto/create-extension.dto';
import { UpdateExtensionDto } from '../dto/update-extension.dto';

@Injectable()
export class ExtensionService {
  constructor(
    @InjectRepository(Extension)
    private readonly extensionRepository: Repository<Extension>
  ) {}

  async create(createExtensionDto: CreateExtensionDto): Promise<Extension> {
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
