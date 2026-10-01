import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('todos')
export class Todo {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Buy milk' })
  @Column()
  title: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  completed: boolean;
}