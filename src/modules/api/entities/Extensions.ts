import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';
import { departments } from './../../../../../service-desk-flow/src/hooks/useRegisterForm';

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