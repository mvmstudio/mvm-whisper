import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем путь к текущему файлу и директории (для совместимости с ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = '15n.mp3'; // Укажи путь к своему файлу

const CHUNK_SIZE = 22 * 1024 * 1024; // 24MB
const OUTPUT_DIR = path.join(__dirname, 'chunks');

// Создаем директорию для чанков, если её нет
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Открываем поток для чтения файла
const readStream = fs.createReadStream(INPUT_FILE, { highWaterMark: CHUNK_SIZE });

let index = 0;
readStream.on('data', (chunk) => {
    const outputFile = path.join(OUTPUT_DIR, `chunk_${index}.mp3`);
    fs.writeFileSync(outputFile, chunk);
    console.log(`Создан: ${outputFile} (${chunk.length} байт)`);
    index++;
});

readStream.on('end', () => {
    console.log('Разделение завершено.');
});

readStream.on('error', (err) => {
    console.error('Ошибка:', err);
});
