import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "@users/services/users.service";
import { User } from "@users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification, NotificationType } from "../entities/notification.entity";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NOTIFICATIONS_UPDATED_EVENT } from "@shared/events";

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly eventEmitter: EventEmitter2,
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ) {
    }

    async findRecentNotifications() {
        return this.notificationRepository.find({
            order: {
                createdAt: 'DESC'
            },
            take: 10
        });
    }

    async sendAccountCreationNotificationsToAdmins(userCreated: User) {
        const admins = await this.usersService.findAllAdmins();

        if (admins.length === 0) {
            await this.usersService.activeUser(userCreated.id);
            return;
        }

        await this.notificationRepository.save({
            type: NotificationType.ACCOUNT_CREATION_REQUEST,
            title: 'Um usuário solicitou a criação de uma conta',
            description: `O usuário ${userCreated.name} solicitou a criação de uma conta`,
            viewed: false,
            requestedUserId: userCreated.id
        });

        this.eventEmitter.emit(NOTIFICATIONS_UPDATED_EVENT);
    }
}
