import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Videos } from './entities/videos';

export const AppDataSource = new DataSource({
    type: 'sqlite',               // Тип бази даних
    database: './database.db',    // Локальний файл SQLite
    synchronize: true,            // Автоматичне створення таблиць (зручно для розробки)
    logging: true,                // Логування запитів
    entities: [Videos], // Шлях до файлів сутностей
    // entities: ['./db/entities/*.ts'], // Шлях до файлів сутностей
});