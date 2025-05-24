import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@users/services/users.service';
import { User } from '@users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NOTIFICATIONS_UPDATED_EVENT } from '@shared/events';
import UserLevel from '@users/entities/user-level';
import UserStatus from '@users/entities/user-status';
import { UserDto } from '@users/dto/user.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async findRecentNotifications() {
    return this.notificationRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });
  }

  async sendAccountCreationNotificationsToAdmins(userCreated: User) {
    const admins = await this.usersService.findAllAdmins();

    this.logger.log(admins);

    if (this.notValidAdmins(admins)) {
      await this.usersService.activeUser(userCreated.id);
      return;
    }

    const notification: Partial<Notification> = {
      type: NotificationType.ACCOUNT_CREATION_REQUEST,
      title: 'Um usuário solicitou a criação de uma conta',
      description: `O usuário ${userCreated.name} solicitou a criação de uma conta`,
      viewed: false,
      level: UserLevel.ADMIN,
      requestedUserId: userCreated.id,
    };

    await this.notificationRepository.save(notification);

    this.eventEmitter.emit(NOTIFICATIONS_UPDATED_EVENT);
  }

  private notValidAdmins(admins: UserDto[]) {
    if (admins.length === 0) return true;

    const onlyOneAdmin = admins.length === 1;

    if (onlyOneAdmin && admins[0].status === UserStatus.PENDING) {
      return true;
    }

    return false;
  }
}
