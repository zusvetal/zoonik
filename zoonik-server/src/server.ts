import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { AppDataSource } from './db/data-source';
import { Videos } from './db/entities/videos';
import * as fs from 'node:fs';

const app = express();
const PORT = 3000;
const UPLOAD_DIR = 'media-files';
const VIDEO_PATH = '/videos';
const UPLOAD_PATH = path.join(__dirname, UPLOAD_DIR);

AppDataSource.initialize().catch((error) => console.error("connect to DB error:", error));

// Налаштування CORS
app.use(cors());
app.use(express.json());
app.use(VIDEO_PATH, express.static(UPLOAD_PATH));

// // Створення папки для завантажень, якщо її немає
// if (!fs.existsSync(UPLOAD_DIR)) {
//     fs.mkdirSync(UPLOAD_DIR);
// }

// Налаштування Multer
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, UPLOAD_PATH);
    },
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Фільтр для перевірки типів файлів
const fileFilter = (req:Request, file:any, cb:any) => {
    const allowedTypes = ['video/mp4', 'video/quicktime'];
    allowedTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Неприпустимий тип файлу. Дозволені тільки MP4 і MOV.'))
};

const upload = multer({ storage, fileFilter });

// Завантаження файлу
app.post('/upload', upload.single('video'),({file}: Request, res: Response) => {
    console.log(file);

    file ? res.json({url:`${VIDEO_PATH}/${file?.filename}`, originalName:file?.filename}) : res.status(400).json({ error: 'Файл не було завантажено' });
});

// Збереження даних про відео файл
app.post('/save-video', async (req: Request, res: Response) => {
    console.log(req.body);
    const fileRepository = AppDataSource.getRepository(Videos)
    const newVideoFile = fileRepository.create(req.body)
    const savedVideo = await fileRepository.save(newVideoFile);

    console.log(savedVideo);

    res.json(savedVideo);
});

app.get('/videos', async (_: Request, res: Response) => {
    const fileRepository = AppDataSource.getRepository(Videos);
    const files = await fileRepository.find();

    res.json(files);
});

app.delete('/video/:id', async (req: Request<{ id: number }>, res: Response):Promise<any> => {
    const fileId = req.params.id;

    try {
        // Знаходимо запис у базі даних
        const fileRepository = AppDataSource.getRepository(Videos);
        const file = await fileRepository.findOneBy({ id: Number(fileId) });

        if (!file) {
            return res.status(404).json({ error: 'Файл не знайдено' });
        }

        // Видаляємо файл із файлової системи
        const filePath =`${UPLOAD_PATH}/${file.originalName}`
        console.log('DELETE',filePath, fs.existsSync(filePath));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Видаляємо запис із бази даних
        await fileRepository.remove(file);

        res.status(200).json({ message: 'Файл успішно видалено' });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});
// AppDataSource.initialize()
//     .then(async () => {
//         console.log("Підключено до бази даних!");
//
//         // Приклад додавання запису
//         // const fileRepository = AppDataSource.getRepository(Videos);
//
//         // const newFile = fileRepository.create({
//         //     name: "Sample2.mp4",
//         //     isActive:true,
//         //     size: 1048576,
//         //     mimeType: "video/mp4",
//         //     description: "Це тестове відео",
//         // });
//         //
//         // await fileRepository.save(newFile);
//         // console.log("Файл збережено:", newFile);
//
//         // Приклад отримання даних
//         // const files = await fileRepository.find();
//         // console.log("Список файлів:", files);
//     })
//     .catch((error) => console.error("connect to DB error:", error));


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});