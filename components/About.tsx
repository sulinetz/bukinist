import React from 'react';
import { Star, Library, Gavel } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-brand-paper">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <div className="flex items-center gap-2 text-brand-primary mb-4">
              <Star size={16} fill="currentColor" />
              <span className="uppercase tracking-widest font-bold text-xs">О Нас</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-6 font-bold">
              Больше, чем просто <br /> книжный магазин
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                «Спутник Букинист» — это культурная точка притяжения на карте Москвы. Расположенные в историческом здании на Ленинском проспекте, мы продолжаем традиции классической букинистики.
              </p>
              <p>
                Мы не только продаем книги, но и ценим их историю. В наших стенах находится аукционный дом <a href="https://ru.bidspirit.com/ui/houses/gagarinsquare" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-primary hover:underline">Gagarinsquare</a>, где проходят торги за уникальные экземпляры, автографы великих писателей и редкие документы эпохи.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-brand-primary/20 rounded-sm bg-white hover:shadow-lg transition-shadow">
                <Library className="text-brand-primary mb-3" size={32} />
                <h3 className="font-serif text-xl font-bold mb-2 text-brand-dark">
                  <a href="#catalog" className="text-brand-dark hover:text-brand-primary transition-colors">Коллекция</a>
                </h3>
                <p className="text-sm text-gray-600">Тысячи томов: от антикварных фолиантов до советской классики — вся <a href="#catalog" className="text-brand-primary hover:underline font-semibold">коллекция</a> доступна для вас.</p>
              </div>
              <div className="p-6 border border-brand-primary/20 rounded-sm bg-white hover:shadow-lg transition-shadow">
                <Gavel className="text-brand-primary mb-3" size={32} />
                <h3 className="font-serif text-xl font-bold mb-2 text-brand-dark">
                  <a href="https://ru.bidspirit.com/ui/houses/gagarinsquare" target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:text-brand-primary transition-colors">Аукционы</a>
                </h3>
                <p className="text-sm text-gray-600">Регулярные <a href="https://ru.bidspirit.com/ui/houses/gagarinsquare" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-semibold">аукционы</a> проходят через международную онлайн-платформу Gagarinsquare.</p>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/about_library.jpg" 
				alt="Antique Bookshelves and Rare Library" 
				referrerPolicy="no-referrer"
				className="rounded-sm shadow-xl w-full h-[400px] object-cover mt-12"
                
              />
              <img 
                src="/about_gavel.jpg" 
				alt="Wooden Auction Gavel" 
				referrerPolicy="no-referrer"
				className="rounded-sm shadow-xl w-full h-[400px] object-cover mb-12"
                
              />
            </div>
            {/* Decorative circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-primary rounded-full flex items-center justify-center text-brand-paper text-center p-4 font-serif font-bold shadow-2xl border-4 border-brand-paper z-10">
              Est. <br/> 2015
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;