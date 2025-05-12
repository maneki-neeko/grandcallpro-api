import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';

/**
 * Entidade que representa um usuário no banco de dados
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  department!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @Column()
  level!: string;
}
