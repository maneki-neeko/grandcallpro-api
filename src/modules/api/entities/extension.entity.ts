import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';

/**
 * Entidade que representa um registro dos ramais
 */
@Entity('extensions')
export class Extension {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  number!: number;

  @Column()
  department!: string;

  @Column()
  sector!: string;

  @Column()
  employee!: string;
}
