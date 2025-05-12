import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Extension } from '../entities/extension.entity';
import { ExtensionService } from '../services/extension.service';
import { CreateExtensionDto } from '../dto/create-extension.dto';
import { UpdateExtensionDto } from '../dto/update-extension.dto';

@Controller('v1/extensions')
export class ExtensionController {
  constructor(private readonly extensionService: ExtensionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExtensionDto: CreateExtensionDto): Promise<Extension> {
    return this.extensionService.create(createExtensionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Extension[]> {
    return this.extensionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<Extension> {
    if (id <= 0) {
      throw new BadRequestException('Id inválido');
    }

    return this.extensionService.findOne(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateExtensionDto: UpdateExtensionDto): Promise<Extension> {
    return this.extensionService.update(updateExtensionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.extensionService.remove(id);
  }
}
