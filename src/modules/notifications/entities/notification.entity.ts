// Entidade Notification
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type NotificationType = 'ACCOUNT_CREATION_REQUEST' | 'CHANGE_PASSWORD_REQUEST' | 'INFO';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: NotificationType;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  viewed: boolean;

  @Column({ type: 'int' })
  requested_user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
