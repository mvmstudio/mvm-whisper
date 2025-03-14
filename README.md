# MVM-Whisper

## Описание проекта

MVM-Whisper — это консольная утилита для транскрибации аудиофайлов с использованием OpenAI Whisper API. Утилита позволяет преобразовывать речь из аудиофайлов в текст с помощью мощной модели распознавания речи от OpenAI.

![MVM-Whisper](https://downloader.disk.yandex.ru/preview/2c7ba24ab839597c4cc9b78f7611b8b3a9dfc78c1feecc609a2937abf026b391/67d2d35d/NdZ-KwIz1NL3PRDYW2Qub4BY0ZtOnrUBI624N4vp4KhW2PdDakY6jVvSsi3povXI_cpcyp82ZyzMjQPAFhhlEA%3D%3D?uid=0&filename=2025-03-13_08-43-34.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=748x748)

### Основные возможности:

- Транскрибация аудиофайлов различных форматов (mp3, wav, m4a, mp4)
- Автоматическое разделение больших файлов на части для обработки
- Отображение прогресса выполнения операций
- Сохранение результатов в текстовые файлы с временной меткой
- Поддержка файлов с пробелами в имени
- Возможность указания API-ключа через параметры командной строки или через .env файл

## Требования

- Node.js (версия 16 или выше)
- OpenAI API ключ

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/yourusername/mvm-whisper.git
   cd mvm-whisper
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Сделайте скрипт исполняемым:
   ```bash
   chmod +x whisper.js
   ```

4. Создайте символическую ссылку для глобального использования (опционально):
   ```bash
   npm link
   ```

## Настройка API ключа

Вы можете указать API ключ OpenAI одним из следующих способов:

1. Через параметр командной строки:
   ```bash
   ./whisper.js audio.mp3 --api-key your_api_key
   ```

2. Через .env файл в директории проекта или в домашней директории:
   ```
   OPENAI_API_KEY=your_api_key
   ```

## Настройка API ключа через .env файл в домашней директории

1. Создайте файл с названием `.env` в вашей домашней директории:
   ```bash
   touch ~/.env
   ```

2. Откройте файл в любом текстовом редакторе и добавьте следующую строку:
   ```
   OPENAI_API_KEY=ваш_api_ключ_openai
   ```

3. Сохраните файл. Этот вариант позволит использовать один и тот же ключ для всех проектов, использующих OpenAI API.

### Примечания:

- Убедитесь, что в файле `.env` нет лишних пробелов или кавычек вокруг значения ключа.
- Файл `.env` обычно не включается в систему контроля версий (добавьте его в `.gitignore`), чтобы защитить ваш API ключ.
- Утилита сначала ищет файл `.env` в текущей директории, и только потом в домашней директории пользователя.
- Если ключ указан и через параметр командной строки, и через `.env` файл, приоритет будет у ключа из командной строки.

## Использование

```bash
whisper <путь_к_аудиофайлу> [опции]
```

### Опции:
- `-k, --api-key <key>` - OpenAI API ключ
- `-h, --help` - Показать справку
- `-V, --version` - Показать версию

### Примеры:

```bash
# Простой файл без пробелов
whisper audio.mp3

# Файл с пробелами в имени
whisper "my audio file.mp3"

# С указанием API ключа
whisper audio.mp3 --api-key your_api_key

# То же самое, короткая форма
whisper audio.mp3 -k your_api_key
```

## Результаты

После успешной транскрибации результаты сохраняются в директории `Whisper` в домашней директории пользователя в формате текстовых файлов с именем `transcript_YYYY-MM-DDTHH-MM-SS-SSSZ.txt`.

## Зависимости

- openai - для работы с OpenAI API
- dotenv - для загрузки переменных окружения из .env файла
- commander - для создания интерфейса командной строки
- cli-progress - для отображения прогресса выполнения
- file-type - для определения типа файла

## Лицензия

MIT

# Установка и настройка MVM-Whisper на Windows

## Установка Node.js

1. Скачайте установщик Node.js с официального сайта: https://nodejs.org/
2. Выберите LTS (Long Term Support) версию для большей стабильности
3. Запустите скачанный установщик и следуйте инструкциям мастера установки
4. Убедитесь, что опция "Automatically install the necessary tools" включена
5. После завершения установки откройте командную строку (cmd) или PowerShell и проверьте установку:
   ```
   node --version
   npm --version
   ```

## Установка MVM-Whisper

1. Скачайте или клонируйте репозиторий:
   ```
   git clone https://github.com/yourusername/mvm-whisper.git
   ```
   Если у вас не установлен Git, вы можете скачать ZIP-архив проекта и распаковать его.

2. Откройте командную строку (cmd) или PowerShell и перейдите в директорию проекта:
   ```
   cd путь\к\mvm-whisper
   ```

3. Установите зависимости:
   ```
   npm install
   ```

## Настройка API ключа на Windows

### Через .env файл:

1. Создайте файл `.env` в директории проекта:
   ```
   echo OPENAI_API_KEY=ваш_api_ключ_openai > .env
   ```
   или создайте файл вручную через Блокнот и сохраните его как `.env` (без расширения .txt)

2. Альтернативно, вы можете создать файл `.env` в вашей домашней директории (обычно `C:\Users\ИмяПользователя\`):
   ```
   echo OPENAI_API_KEY=ваш_api_ключ_openai > %USERPROFILE%\.env
   ```

## Запуск утилиты на Windows

Поскольку Windows не поддерживает шебанг (`#!/usr/bin/env node`), вам нужно запускать скрипт через Node.js:

```
node whisper.js "путь\к\аудиофайлу.mp3"
```

Для удобства использования вы можете создать batch-файл (например, `whisper.bat`) со следующим содержимым:

```batch
@echo off
node "%~dp0whisper.js" %*
```

Поместите этот файл в директорию проекта и добавьте путь к этой директории в переменную среды PATH:

1. Нажмите Win + X и выберите "Система"
2. Нажмите "Дополнительные параметры системы"
3. Нажмите "Переменные среды"
4. В разделе "Переменные среды пользователя" найдите переменную PATH и нажмите "Изменить"
5. Нажмите "Создать" и добавьте полный путь к директории с файлом whisper.bat
6. Нажмите "ОК" во всех окнах

После этого вы сможете запускать утилиту из любой директории, просто набрав:

```
whisper "путь\к\аудиофайлу.mp3"
```

## Возможные проблемы на Windows

1. **Проблемы с путями к файлам**: Windows использует обратный слеш (`\`) в путях, но в командной строке его нужно экранировать или использовать прямой слеш (`/`).

2. **Проблемы с кодировкой**: Если в выводе появляются некорректные символы, попробуйте изменить кодировку консоли:
   ```
   chcp 65001
   ```

3. **Проблемы с правами доступа**: Запустите командную строку или PowerShell от имени администратора, если возникают ошибки доступа.

4. **Проблемы с .env файлом**: Убедитесь, что файл сохранен без расширения .txt. В проводнике Windows может быть скрыто расширение файла, поэтому файл может выглядеть как `.env`, но на самом деле быть `.env.txt`.

