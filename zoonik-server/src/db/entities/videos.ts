import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Позначає клас як сутність
export class Videos {
    @PrimaryGeneratedColumn() // Автоматично генерує ID
    id!: number;

    @Column()
    name!: string;

    @Column()
    originalName!: string;

    @Column()
    isActive!: boolean;

    @Column()
    url!:string;

    // @Column() // Розмір файлу
    // size!: number;
    //
    // @Column() // MIME-тип файлу
    // mimeType!: string;

    @Column({ nullable: true }) // Опис (може бути null)
    description?: string;

    @CreateDateColumn() // Дата створення запису
    uploadDate!: Date;
}