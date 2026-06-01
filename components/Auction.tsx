import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { catalogData } from '../data/books';
import BookCover from './BookCover';

const Auction: React.FC = () => {
  const [featuredBook, setFeaturedBook] = useState<typeof catalogData[0] | null>(null);

  useEffect(() => {
    // Select from our high-end valuable acquisitions
    const premiumExhibits = catalogData.filter(b => b.price >= 40000);
    const items = premiumExhibits.length > 0 ? premiumExhibits : catalogData;
    const randomIndex = Math.floor(Math.random() * items.length);
    setFeaturedBook(items[randomIndex]);
  }, []);

  const handleAlibSearch = (e: React.MouseEvent, book: any) => {
    e.preventDefault();
    const isAuthorUnknown = !book.author || 
      /автор\s+не\s+указан|нет\s+автора|не\s+указан|unknown|автор/i.test(book.author);
    const safeAuthor = isAuthorUnknown ? "" : (book.author || '').replace(/[.,/#!$%^&*;:{}=\-_`~()–—]/g, " ");
    const safeTitle = (book.title || '').replace(/[.,/#!$%^&*;:{}=\-_`~()–—]/g, " ");
    const safeYear = (book.year || '').replace(/[.,/#!$%^&*;:{}=\-_`~()–—]/g, " ");
    const query = `${safeAuthor} ${safeTitle} ${safeYear}`.replace(/\s+/g, " ").trim();
    
    // Programmatically trigger Windows-1251 search
    const form = document.createElement('form');
    form.action = 'https://www.alib.ru/find3.php4';
    form.method = 'GET';
    form.target = '_blank';
    form.setAttribute('accept-charset', 'windows-1251');

    const bsonlyInput = document.createElement('input');
    bsonlyInput.type = 'hidden';
    bsonlyInput.name = 'bsonly';
    bsonlyInput.value = 'Sputnik';
    form.appendChild(bsonlyInput);

    const tfindInput = document.createElement('input');
    tfindInput.type = 'hidden';
    tfindInput.name = 'tfind';
    tfindInput.value = query;
    form.appendChild(tfindInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <section id="auction" className="py-24 bg-brand-dark text-white overflow-hidden relative">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 mb-6">
               <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
               <span className="text-brand-primary text-xs font-bold tracking-[0.2em] uppercase">Gagarinsquare - Онлайн Торги</span>
            </div>
            
            <h2 className="font-sans text-4xl md:text-6xl font-black mb-8 leading-tight uppercase">
              Космос <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Антиквариата</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl font-light">
              Наш аукционный дом — это площадка, где встречаются редчайшие раритеты. 
              Специализируемся на старинных и советских книгах, автографах, исторических документах, плакатах и графике. 
              Прозрачность сделок и профессиональная экспертиза.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-10">
               <div>
                  <h4 className="text-brand-primary font-bold text-xl mb-2">1000+</h4>
                  <p className="text-sm text-gray-400">Лотов ежегодно</p>
               </div>
               <div>
                  <h4 className="text-brand-primary font-bold text-xl mb-2">100%</h4>
                  <p className="text-sm text-gray-400">Гарантия подлинности</p>
               </div>
            </div>

            <a 
              href="https://ru.bidspirit.com/ui/houses/gagarinsquare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex group px-8 py-4 bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-bold transition-all rounded-sm items-center gap-3 uppercase tracking-widest text-sm"
            >
              Перейти к торгам Bidspirit ↗
              <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
            </a>
          </div>

          <div className="lg:w-1/2 relative perspective-1000">
            {/* Floating Cards Effect */}
            <div className="relative z-20 transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
              {featuredBook ? (
                <BookCover 
                  book={featuredBook} 
                  className="rounded-lg shadow-2xl border border-white/10 max-h-[480px] w-[330px] mx-auto aspect-[3/4]"
                />
              ) : (
                <div className="rounded-lg shadow-2xl border border-white/10 h-[440px] w-[330px] mx-auto bg-[#1e293b] animate-pulse" />
              )}
              
              {/* Lot Card Overlay */}
              <div className="absolute -bottom-6 -left-6 bg-brand-surface p-5 rounded-lg border border-brand-primary/30 shadow-2xl max-w-[280px]">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-brand-primary text-[10px] font-extrabold uppercase tracking-wider">Экспонат коллекции</span>
                   <span className="bg-brand-primary/20 text-brand-primary text-[10px] px-2 py-0.5 rounded-sm font-bold">VIP</span>
                </div>
                
                <h4 className="font-serif font-bold text-white text-base leading-snug mb-1 line-clamp-2">
                  {featuredBook?.title || "Дон Кихот"}
                </h4>
                <p className="text-xs text-gray-300 mb-1 italic font-medium">{featuredBook?.author || "Автор неизвестен"}</p>
                <p className="text-gray-400 text-[10px] mb-3">Издание {featuredBook?.year || "—"} г.</p>
                <div className="h-px w-full bg-white/10 mb-3"></div>
                
                <div className="flex justify-between items-center gap-4">
                   <div>
                     <span className="text-[9px] text-gray-500 uppercase block">Оценка фолианта</span>
                     <span className="text-brand-primary font-bold text-base font-mono">
                       {featuredBook ? new Intl.NumberFormat('ru-RU').format(featuredBook.price) : '0'} ₽
                     </span>
                   </div>
                   
                   {featuredBook && (
                     <a 
                       href="#"
                       onClick={(e) => handleAlibSearch(e, featuredBook)}
                       className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-brand-dark hover:bg-white hover:text-brand-dark text-[10px] uppercase font-serif tracking-tight font-extrabold transition-all rounded-sm shadow-sm"
                     >
                       Купить ↗
                     </a>
                   )}
                </div>
              </div>
            </div>
            
            {/* Decorative elements behind */}
            <div className="absolute top-10 -right-10 w-full h-full border-2 border-brand-primary/20 rounded-lg -z-10"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Auction;