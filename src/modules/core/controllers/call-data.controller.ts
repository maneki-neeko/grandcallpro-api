import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { CallDataService } from '../services/call-data.service';
import { UcmCallDataDto } from '../dto/ucm-call-data.dto';
import { CallRecord } from '../entities/call-record.entity';

@Controller('core')
export class CallDataController {
  constructor(private readonly callDataService: CallDataService) {}

  /**
   * Endpoint para receber dados de chamada
   */
  @Post('data')
  @HttpCode(HttpStatus.CREATED)
  async receiveCallData(@Body() callData: UcmCallDataDto): Promise<{ message: string }> {
    return this.callDataService.processCallData(callData);
  }

  /**
   * Endpoint para listar todos os registros de chamada
   */
  @Get('troubleshooting/data')
  @HttpCode(HttpStatus.OK)
  async listAllCallData(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<CallRecord[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    return this.callDataService.findAll(limitNum, offsetNum);
  }

  /**
   * Endpoint para buscar registros de chamada por uniqueId
   */
  @Get('troubleshooting/data/:uniqueId')
  @HttpCode(HttpStatus.OK)
  async findCallDataByUniqueId(@Param('uniqueId') uniqueId: string): Promise<CallRecord[]> {
    const records = await this.callDataService.findByUniqueId(uniqueId);

    if (!records) {
      throw new NotFoundException(`Call record with uniqueId ${uniqueId} not found`);
    }

    return records;
  }
}
