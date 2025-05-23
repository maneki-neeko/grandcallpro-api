import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum NotificationType {
    ACCOUNT_CREATION_REQUEST = 'ACCOUNT_CREATION_REQUEST',
    CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST',
    INFO = 'INFO'
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', enum: NotificationType })
    type: NotificationType;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    viewed: boolean;

    @Column()
    requestedUserId: number;
}
