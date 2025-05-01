import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';

@Entity('extensions')
export class Extensions {
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