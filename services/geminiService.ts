// No external imports needed anymore
import { catalogData } from '../data/books';

/**
 * Simulates a response from the "Virtual Assistant" without using Google AI.
 * This ensures the site works even if the API key is missing or the package fails to install.
 */
export const sendGeminiMessage = async (history: any[], userMessage: string): Promise<string> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerMsg = userMessage.toLowerCase();

  // Simple keyword matching logic
  if (lowerMsg.includes('цен') || lowerMsg.includes('стоит') || lowerMsg.includes('оцен') || lowerMsg.includes('продать')) {
    return "Для точной оценки книги нам потребуется её визуальный осмотр. Пожалуйста, пришлите фотографии (обложка, титульный лист, дефекты) на почту info@bs-sputnik.ru или позвоните нам +7 (495) 952-XX-XX. Мы также ждем вас по адресу: Ленинский проспект, 32.";
  }

  if (lowerMsg.includes('каталог') || lowerMsg.includes('книг') || lowerMsg.includes('есть') || lowerMsg.includes('наличи')) {
     const foundBook = catalogData.find(b => lowerMsg.includes(b.author.toLowerCase()) || lowerMsg.includes(b.title.toLowerCase()));
     
     if (foundBook) {
       return `Да, у нас есть "${foundBook.title}" (${foundBook.author}). Стоимость: ${new Intl.NumberFormat('ru-RU').format(foundBook.price)} ₽. Вы можете найти её в каталоге на сайте.`;
     }
     
     return "Вы можете ознакомиться с избранными поступлениями в разделе 'Каталог' на нашем сайте. Если вы ищете конкретное издание, которого нет в списке, свяжитесь с нами — мы проверим наши фонды.";
  }

  if (lowerMsg.includes('аукцион')) {
    return "Наш аукционный дом Gagarinsquare проводит регулярные торги редких изданий, автографов и графики. Подробности о ближайшем аукционе и правилах участия вы можете узнать в разделе 'Аукцион' или по телефону.";
  }

  if (lowerMsg.includes('адрес') || lowerMsg.includes('где') || lowerMsg.includes('наход')) {
    return "Мы находимся по адресу: Москва, Ленинский проспект, 32. Вход с проспекта, ориентируйтесь на историческую вывеску 'Спутник'. Работаем ежедневно.";
  }

  // Default fallback response
  return "Спасибо за ваш вопрос! Я — виртуальный помощник салона «Спутник». Я пока не могу ответить на этот сложный вопрос, но наши специалисты с радостью проконсультируют вас по телефону +7 (495) 952-XX-XX.";
};