// Service NotificationService
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

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
}
