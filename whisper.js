#!/usr/bin/env node

// Отключаем предупреждения о устаревших модулях
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name !== 'DeprecationWarning') {
    console.warn(warning);
  }
});

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import cliProgress from "cli-progress";
import { program } from "commander";
import { fileTypeFromFile } from "file-type";

// Загружаем .env файл из текущей директории или из домашней директории пользователя
const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.env.HOME || process.env.USERPROFILE, '.env')
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

// Получаем путь к директории скрипта
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
// Константы для путей относительно директории скрипта
const CHUNK_SIZE = 19 * 1024 * 1024; // 19MB (оставляем запас)
const CHUNKS_DIR = path.join(SCRIPT_DIR, "chunks");
const RESULTS_DIR = path.join(SCRIPT_DIR, "result");

let openai; // Будет инициализирован после получения API ключа

// Создаем необходимые директории
function createDirectories() {
  [CHUNKS_DIR, RESULTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Функция для разделения файла на чанки
async function splitFileIntoChunks(filePath) {
  const fileStats = fs.statSync(filePath);
  const totalSize = fileStats.size;
  const chunks = Math.ceil(totalSize / CHUNK_SIZE);
  
  console.log(`\n📦 Разделение файла на чанки...`);
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(chunks, 0);

  const fileType = await fileTypeFromFile(filePath);
  if (!fileType || !fileType.ext.match(/mp3|wav|m4a|mp4/)) {
    throw new Error("Неподдерживаемый формат файла!");
  }

  const chunkFiles = [];
  const readStream = fs.createReadStream(filePath);
  let chunkNumber = 0;
  let currentChunk = Buffer.alloc(0);

  return new Promise((resolve, reject) => {
    readStream.on("data", (chunk) => {
      currentChunk = Buffer.concat([currentChunk, chunk]);
      
      while (currentChunk.length >= CHUNK_SIZE) {
        const chunkFile = path.join(CHUNKS_DIR, `chunk_${chunkNumber}.${fileType.ext}`);
        fs.writeFileSync(chunkFile, currentChunk.slice(0, CHUNK_SIZE));
        chunkFiles.push(chunkFile);
        
        currentChunk = currentChunk.slice(CHUNK_SIZE);
        chunkNumber++;
        progressBar.update(chunkNumber);
      }
    });

    readStream.on("end", () => {
      if (currentChunk.length > 0) {
        const chunkFile = path.join(CHUNKS_DIR, `chunk_${chunkNumber}.${fileType.ext}`);
        fs.writeFileSync(chunkFile, currentChunk);
        chunkFiles.push(chunkFile);
        progressBar.update(chunks);
      }
      progressBar.stop();
      resolve(chunkFiles);
    });

    readStream.on("error", reject);
  });
}

// Функция для транскрибации одного чанка
async function transcribeChunk(filePath, progressBar) {
  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "text"
    });
    return response;
  } catch (error) {
    console.error(`\n❌ Ошибка при транскрибации ${filePath}:`, error);
    return "";
  }
}

// Основная функция обработки
async function processAudioFile(inputFile, options) {
  try {
    // Инициализация OpenAI API
    const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("API ключ не указан. Используйте опцию --api-key или установите переменную окружения OPENAI_API_KEY");
    }

    openai = new OpenAI({ apiKey });
    
    // Обработка пути к файлу
    const normalizedPath = inputFile.replace(/\\ /g, ' '); // Заменяем экранированные пробелы
    const absoluteInputPath = path.resolve(normalizedPath);

    // Проверка существования файла
    if (!fs.existsSync(absoluteInputPath)) {
      throw new Error(`Файл не найден: ${absoluteInputPath}\nУбедитесь, что путь указан верно и файл существует.`);
    }

    createDirectories();
    
    console.log(`\n📂 Обработка файла: ${absoluteInputPath}`);
    
    // Разделение на чанки
    const chunkFiles = await splitFileIntoChunks(absoluteInputPath);
    
    // Транскрибация чанков
    console.log("\n🎯 Транскрибация чанков...");
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(chunkFiles.length, 0);
    
    const transcriptions = [];
    for (let i = 0; i < chunkFiles.length; i++) {
      const transcription = await transcribeChunk(chunkFiles[i], progressBar);
      if (transcription && transcription.trim()) {
        transcriptions.push(transcription);
      }
      progressBar.update(i + 1);
    }
    progressBar.stop();

    if (transcriptions.length === 0) {
      throw new Error("Не удалось получить текст из аудио. Проверьте качество файла и его формат.");
    }

    // Сохранение результата
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const resultFile = path.join(RESULTS_DIR, `transcript_${timestamp}.txt`);
    
    // Объединяем все транскрипции с двойным переносом строки между ними
    const fullText = transcriptions.join("\n\n");
    fs.writeFileSync(resultFile, fullText, "utf8");

    // Очистка чанков
    chunkFiles.forEach(file => fs.unlinkSync(file));
    
    // Получаем абсолютный путь к результату
    const absoluteResultPath = path.resolve(resultFile);
    
    console.log(`\n✅ Транскрибация завершена!`);
    console.log(`📝 Размер текста: ${(fullText.length / 1024).toFixed(2)} KB`);
    console.log(`\n📄 Результат сохранён в:`);
    console.log(`file://${absoluteResultPath}`);
  } catch (error) {
    console.error("\n❌ Произошла ошибка:", error.message);
    process.exit(1);
  }
}

// Настройка CLI
program
  .name('whisper')
  .description('Транскрибация аудио файлов с помощью OpenAI Whisper API')
  .version('1.0.0')
  .argument("<inputFile>", 'Путь к аудиофайлу для транскрибации (если путь содержит пробелы, заключите его в кавычки: whisper "my audio file.mp3")')
  .option('-k, --api-key <key>', 'OpenAI API ключ (также можно указать через OPENAI_API_KEY в .env файле)')
  .addHelpText('after', `
Примеры:
  $ whisper audio.mp3                              # Простой файл без пробелов
  $ whisper "my audio file.mp3"                    # Файл с пробелами в имени
  $ whisper audio.mp3 --api-key your_api_key       # С указанием API ключа
  $ whisper audio.mp3 -k your_api_key              # То же самое, короткая форма
  `)
  .action(processAudioFile);

program.parse(process.argv);
