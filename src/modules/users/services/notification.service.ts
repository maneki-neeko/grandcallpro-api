import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "@users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification, NotificationType } from "@users/entities/notification.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ) {
    }

    async sendAccountCreationNotificationsToAdmins(userCreated: User) {
        const admins = await this.usersService.findAllAdmins();

        if (admins.length === 0) {
            await this.usersService.activeUser(userCreated.id);
            return;
        }

        this.notificationRepository.save({
            type: NotificationType.ACCOUNT_CREATION_REQUEST,
            title: 'Um usuário foi criado',
            description: `O usuário ${userCreated.name} foi criado`,
            viewed: false,
            requestedUserId: userCreated.id
        });

        for (const admin of admins) {
            // TBD
        }
    }
}