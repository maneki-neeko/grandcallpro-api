import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import UserLevel from "./user-level";

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

    @Column({ type: 'text', enum: UserLevel })
    level: UserLevel

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    viewed: boolean;

    @Column()
    requestedUserId: number;

    @CreateDateColumn()
    createdAt: Date;
}
