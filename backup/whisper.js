import fs from "fs";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

// 🔹 Укажи путь до аудиофайла и название файла для сохранения результата
const BASE_NAME = "chunk_3";

const AUDIO_FILE_PATH = `chunks/${BASE_NAME}.mp3`; // Укажи свой путь
const OUTPUT_FILE = `${BASE_NAME}.txt`; // Укажи имя выходного файла

// Инициализация OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio() {
  try {
    // Проверяем существование файла
    if (!fs.existsSync(AUDIO_FILE_PATH)) {
      console.error("❌ Файл не найден!");
      return;
    }

    console.log("⏳ Отправка файла на транскрибацию...");

    // Отправляем файл в OpenAI Whisper
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(AUDIO_FILE_PATH),
      model: "whisper-1",
      language: "en", // Можно изменить язык
      response_format: "verbose_json",
      timestamp_granularities: "segment"
    });

    const transcript = response.text;

    // Сохраняем результат в файл
    fs.writeFileSync(OUTPUT_FILE, transcript, "utf8");

    console.log(`✅ Транскрибация завершена! Файл сохранён как ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Ошибка при транскрибации:", error);
  }
}

// Запуск функции
transcribeAudio();
