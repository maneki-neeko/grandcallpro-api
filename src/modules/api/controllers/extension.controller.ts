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
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Extension } from '@api/entities/extension.entity';
import { ExtensionService } from '@api/services/extension.service';
import { CreateExtensionDto } from '@api/dto/create-extension.dto';
import { UpdateExtensionDto } from '@api/dto/update-extension.dto';
import { JwtAuthGuard } from '@users/guards/jwt-auth.guard';

@Controller('v1/extensions')
export class ExtensionController {
  constructor(private readonly extensionService: ExtensionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(@Body() createExtensionDto: CreateExtensionDto): Promise<Extension> {
    return this.extensionService.create(createExtensionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Extension[]> {
    return this.extensionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Extension> {
    return this.extensionService.findOne(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(@Body() updateExtensionDto: UpdateExtensionDto): Promise<Extension> {
    return this.extensionService.update(updateExtensionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    await this.extensionService.remove(id);
  }
}
