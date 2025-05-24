import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { USER_CREATED_EVENT } from '@shared/events';
import { User } from '@users/entities/user.entity';
import { retryWithBackoff } from '@shared/retry-strategy';

@Injectable()
export class NotificationEventListenerService {
  private readonly logger = new Logger(NotificationEventListenerService.name);

  // Configurações para o mecanismo de retry
  private readonly maxRetries = 3;
  private readonly initialDelayMs = 1000; // 1 segundo
  private readonly maxDelayMs = 10000; // 10 segundos
  private readonly attempt = 1;

  constructor(private notificationService: NotificationService) {}

  @OnEvent(USER_CREATED_EVENT)
  async handleUserCreatedEvent(userCreated: User) {
    await retryWithBackoff(
      () => this.notificationService.sendAccountCreationNotificationsToAdmins(userCreated),
      this.maxRetries,
      this.maxDelayMs,
      this.initialDelayMs,
      this.attempt,
      this.logger
    );
  }
}
