const fs = require('fs');

/**
 * Локальный сверхнадежный скрипт для конвертации файла базы книг (catalog.csv) в формат types.ts/books.ts
 * Поддерживает автоопределение кодировки (UTF-8 и Windows-1251) для корректного чтения экспорта из Excel.
 * Работает без сторонних npm-зависимостей!
 */

const inputFilePath = 'catalog.csv';

// Функция для безопасного парсинга строки CSV с поддержкой кавычек
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(field => {
    let clean = field.trim();
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.slice(1, -1);
    }
    return clean.replace(/""/g, '"').trim();
  });
}

try {
  if (!fs.existsSync(inputFilePath)) {
    console.error(`❌ Ошибка: Файл '${inputFilePath}' не найден в текущей папке.`);
    console.log('💡 Инструкция:');
    console.log('1. Сохраните вашу таблицу из Excel или Google Таблиц в формат CSV (разделитель - точка с запятой).');
    console.log(`2. Назовите этот файл '${inputFilePath}' и положите его в ту же папку, где лежит этот скрипт.`);
    console.log('3. Запустите скрипт заново: node convert-books.js');
    process.exit(1);
  }

  const rawBuffer = fs.readFileSync(inputFilePath);

  // Автоматическое определение кодировки (UTF-8 vs Windows-1251)
  let isUtf8 = true;
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(rawBuffer);
  } catch (e) {
    isUtf8 = false;
  }

  const encodingName = isUtf8 ? 'utf-8' : 'windows-1251';
  console.log(`📡 Обнаружена кодировка файла: ${encodingName.toUpperCase()}`);

  const decoder = new TextDecoder(encodingName);
  const data = decoder.decode(rawBuffer);
  
  // Разделение на строки (с поддержкой разных окончаний строк)
  const rawLines = data.split(/\r?\n/);
  if (rawLines.length < 2) {
    console.error('❌ Ошибка: Файл пуст или содержит только одну строку.');
    process.exit(1);
  }

  // Пропускаем заголовок
  const header = rawLines[0];
  const lines = rawLines.slice(1).filter(l => l.trim() !== '');

  console.log(`📖 Чтение данных... Обнаружено строк с книгами: ${lines.length}`);

  const books = lines.map((line, idx) => {
    const cols = parseCSVLine(line);
    
    // Номера колонок (0-индексированные):
    // 0: рубрика (id)
    // 1: автор
    // 2: название
    // 6: год
    // 11: цена
    // 12: дополнительно (описание)
    // 13: состояние
    // 15: фотографии

    const id = cols[0] || `item-${idx + 1}`;
    const author = cols[1] || 'Автор не указан';
    const title = cols[2] || 'Без названия';
    
    // Парсинг года
    const rawYear = cols[6] || '';
    const yearMatch = rawYear.match(/\d+/);
    const year = yearMatch ? yearMatch[0] : 'б/г';

    // Парсинг цены (убираем лишние пробелы, которые ставит Excel в числах типа 1 500)
    const rawPrice = cols[11] || '';
    const priceCleaned = rawPrice.replace(/\s+/g, '');
    const price = parseInt(priceCleaned, 10) || 0;

    const description = cols[12] || '';
    const condition = cols[13] || '';

    // Парсинг фотографии
    let rawPhoto = cols[15] || '';
    if (rawPhoto.includes(':')) {
      rawPhoto = rawPhoto.split(':')[0];
    }
    
    let coverUrl = '';
    if (rawPhoto) {
      if (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://')) {
        coverUrl = rawPhoto;
      } else if (rawPhoto.startsWith('foto.alib.ru/')) {
        coverUrl = 'https://' + rawPhoto;
      } else {
        // Относительный путь на Alib.ru
        coverUrl = 'https://foto.alib.ru/gallery/sputnik/' + rawPhoto;
      }
    } else {
      coverUrl = 'https://placehold.co/400x600/1e293b/C5A572?text=Sputnik+Bukinist';
    }

    // Определение категории
    let category = 'Art'; // По умолчанию
    const yearNum = parseInt(year);
    if (!isNaN(yearNum)) {
      if (yearNum < 1917) {
        category = 'Antique';
      } else if (yearNum >= 1917 && yearNum <= 1991) {
        category = 'Soviet';
      }
    }
    
    const combinedTexts = `${title} ${description} ${condition}`.toLowerCase();
    if (combinedTexts.includes('автограф') || combinedTexts.includes('подпись') || combinedTexts.includes('надпись')) {
      category = 'Autograph';
    }
    if (cols[0] && (cols[0].toLowerCase().startsWith('prog') || cols[0].toLowerCase().startsWith('tech') || combinedTexts.includes('программир') || combinedTexts.includes('техн'))) {
      category = 'Technical';
    }

    return {
      id,
      title,
      author,
      year,
      price,
      description,
      condition,
      coverUrl,
      category
    };
  });

  // Шаблон выходящего TypeScript файла
  const tsContent = `// Сгенерированный автоматически файл базы данных книг
import { Book } from '../types';

export const catalogData: Book[] = ${JSON.stringify(books, null, 2)};
`;

  // Поддержим разные структуры проектов (как ./data/books.ts, так и ./src/data/books.ts)
  const pathsToTry = ['./data/books.ts', './src/data/books.ts'];
  let written = false;

  pathsToTry.forEach(p => {
    try {
      const dir = p.substring(0, p.lastIndexOf('/'));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(p, tsContent, 'utf8');
      console.log(`✅ Файл успешно обновлен по пути: ${p}`);
      written = true;
    } catch (e) {
      // Игнорируем ошибки для путей, которые не удалось записать
    }
  });

  if (!written) {
    // Если папки не нашлись, пишем просто рядом
    fs.writeFileSync('./books_converted.ts', tsContent, 'utf8');
    console.log('✅ Создан резервный файл: ./books_converted.ts (скопируйте его содержимое в data/books.ts вашего проекта).');
  }

  console.log(`🎉 Конвертация завершена! Успешно обработано книг: ${books.length}`);

} catch (err) {
  console.error('❌ Критическая ошибка выполнения скрипта:', err.message);
}
