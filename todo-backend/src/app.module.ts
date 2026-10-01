import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module.js';
import { Todo } from './todos/entities/todo.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'zuzy1622',
      database: process.env.DB_DATABASE || 'todo_db',
      entities: [Todo],
      synchronize: true,
    }),
    TodosModule,
  ],
})
export class AppModule {}