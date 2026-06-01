import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к файлу с данными от Alib (создайте books.txt в корне проекта и вставьте туда текст)
const INPUT_FILE = path.join(__dirname, '..', 'books.txt');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'books.ts');

console.log('🚀 Начинаем импорт книг из Alib формата...');

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`❌ Файл ${INPUT_FILE} не найден!`);
  console.log('💡 Создайте файл books.txt в корне проекта и скопируйте туда список книг с Alib.');
  process.exit(1);
}

const rawData = fs.readFileSync(INPUT_FILE, 'utf-8');
const lines = rawData.split('\n').filter(line => line.trim() !== '');

const books = [];

lines.forEach((line, index) => {
  // 1. Пропускаем проданные книги (начинаются с "prod")
  if (line.trim().startsWith('prod')) {
    // Если хотите включать проданные, закомментируйте эти 3 строки
    // console.log(`⏩ Пропуск (продано): ${line.substring(0, 30)}...`);
    // return; 
  }

  // Очистка от 'prod' в начале, если решили оставить
  let cleanLine = line.trim().replace(/^prod\s+/, '');

  try {
    // Парсинг строки Alib
    // Пример: Лагин Л. Старик Хоттабыч. ... формат. 1500 хорошее, потертости ... 07.05.2025 foto.alib.ru...

    // 1. Извлекаем картинки (обычно в конце, содержат 'foto.alib.ru')
    const imgRegex = /(foto\.alib\.ru[^\s:]+)/g;
    const images = cleanLine.match(imgRegex) || [];
    const coverUrl = images.length > 0 ? `https://${images[0]}` : null;

    // Удаляем картинки и техническую инфу в конце (BSст...) из строки для дальнейшего разбора
    let textPart = cleanLine.replace(/foto\.alib\.ru.*$/, '').trim();
    // Удаляем дату в конце (DD.MM.YYYY)
    textPart = textPart.replace(/\d{2}\.\d{2}\.\d{4}$/, '').trim();

    // 2. Ищем Цену. Обычно это число перед описанием состояния в конце.
    // Ищем последнее число в строке.
    const priceMatch = textPart.match(/(\d+)\s+([а-яА-ЯёЁ,\s]+)$/);
    
    let price = 0;
    let condition = '';
    let mainInfo = textPart;

    if (priceMatch) {
      price = parseInt(priceMatch[1], 10);
      condition = priceMatch[2].trim();
      // Отрезаем цену и состояние от основной инфы
      mainInfo = textPart.substring(0, priceMatch.index).trim();
    } else {
      // Если регулярка не сработала, пробуем просто найти последнее число
      const simplePriceMatch = textPart.match(/(\d+)\s*$/);
      if (simplePriceMatch) {
         price = parseInt(simplePriceMatch[1], 10);
         mainInfo = textPart.substring(0, simplePriceMatch.index).trim();
      }
    }

    // 3. Автор и Название.
    // Обычно: Автор. Название. Описание.
    // Попробуем разбить по первой точке.
    const firstDotIndex = mainInfo.indexOf('.');
    let author = 'Неизвестен';
    let title = mainInfo;
    let description = '';

    if (firstDotIndex > 0 && firstDotIndex < 50) { // Если точка не слишком далеко
       author = mainInfo.substring(0, firstDotIndex).trim();
       let rest = mainInfo.substring(firstDotIndex + 1).trim();
       
       // Ищем следующую точку для конца названия, но это ненадежно.
       // Часто лучше взять первое предложение как название.
       const secondDotIndex = rest.indexOf('.');
       if (secondDotIndex > 0) {
          title = rest.substring(0, secondDotIndex).trim();
          description = rest.substring(secondDotIndex + 1).trim();
       } else {
          title = rest;
       }
    }

    // Год издания (ищем 4 цифры)
    const yearMatch = mainInfo.match(/(18|19|20)\d{2}/);
    const year = yearMatch ? yearMatch[0] : '';

    // Категория (простая логика)
    let category = 'Antique';
    const yearNum = parseInt(year);
    if (yearNum >= 1917 && yearNum < 1991) category = 'Soviet';
    if (yearNum >= 1991) category = 'Art'; // Условно современное/искусство
    if (mainInfo.toLowerCase().includes('автограф') || mainInfo.toLowerCase().includes('подпись')) category = 'Autograph';

    books.push({
      id: `imported-${index}`,
      title: title || 'Без названия',
      author: author || 'Автор не указан',
      year: year || 'н.д.',
      price: price,
      description: description || condition, // Если описания нет, пишем состояние
      condition: condition,
      coverUrl: coverUrl || 'https://placehold.co/400x600?text=No+Photo', // Заглушка
      category: category
    });

  } catch (e) {
    console.error(`⚠️ Ошибка при разборе строки ${index}:`, e);
  }
});

const fileContent = `
import { Book } from '../types';

export const catalogData: Book[] = ${JSON.stringify(books, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, fileContent);

console.log(`✅ Успешно импортировано ${books.length} книг!`);
console.log(`📂 Файл обновлен: ${OUTPUT_FILE}`);
