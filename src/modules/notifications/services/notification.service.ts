// Service NotificationService
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';
import { throwNotificationNotFound, throwNotificationAlreadyExists } from '../errors';
import UserLevel from '../../users/entities/user-level';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async create(notification: Partial<Notification>): Promise<Notification> {
    const entity = this.notificationRepository.create(notification);
    return this.notificationRepository.save(entity);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { requested_user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async markAsViewed(id: number): Promise<void> {
    await this.notificationRepository.update(id, { viewed: true });
  }

  async delete(id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async notifyAdmins(
    type: NotificationType,
    title: string,
    description: string,
    requestedUserId: number
  ): Promise<Notification[]> {
    // Busca admins
    const admins = await this.notificationRepository.manager.query(
      `SELECT id FROM users WHERE level = ?`,
      [UserLevel.ADMIN]
    );
    if (!admins.length) return [];
    // Garante que não existe notificação pendente igual para o mesmo usuário
    const exists = await this.notificationRepository.findOne({
      where: { type: type as NotificationType, requested_user_id: requestedUserId, viewed: false },
    });
    if (exists) throwNotificationAlreadyExists();
    // Cria notificação para cada admin
    const notifications = await Promise.all(
      admins.map(() =>
        this.notificationRepository.save(
          this.notificationRepository.create({
            type: type as NotificationType,
            title,
            description,
            requested_user_id: requestedUserId,
            viewed: false,
          })
        )
      )
    );
    return notifications;
  }

  async getById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) throwNotificationNotFound();
    return notification;
  }
}
