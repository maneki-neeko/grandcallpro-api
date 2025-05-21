import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';

@Controller('v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(@Request() req) {
    // req.user.id deve estar disponível pelo JwtAuthGuard
    return this.notificationService.findByUser(req.user.id);
  }
}
