import React, { useState, useEffect } from 'react';
import { Search, Book as BookIcon, ChevronRight, Tag, Sparkles, ExternalLink, Filter, HelpCircle } from 'lucide-react';
import { catalogData } from '../data/books';
import { RUBRICS_MAP } from '../data/rubrics';
import BookCover from './BookCover';

const Catalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRubric, setSelectedRubric] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // fallback filter (Antique, Soviet, etc.)
  const [visibleCount, setVisibleCount] = useState(12);
  const [showAllRubrics, setShowAllRubrics] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-desc' | 'price-asc'>('default');

  // Helper to extract rubric codes from book ID
  const getBookRubrics = (book: any): string[] => {
    if (!book.id) return [];
    const parts = book.id.split('.');
    const found = parts.filter((p: string) => RUBRICS_MAP[p] !== undefined);
    if (found.length > 0) return found;

    // Fallback based on metadata or categories
    if (book.category === 'Technical') return ['prog'];
    if (book.category === 'Art') return ['tjivo'];
    if (book.category === 'Soviet') return ['tiross3'];
    if (book.category === 'Antique') return ['tiross2'];
    if (book.category === 'Autograph') return ['tdokum'];
    return [];
  };

  // 1. Calculate book counts and track the most premium (expensive) items per rubric
  const rubricCounts: Record<string, number> = {};
  const rubricMostValuable: Record<string, typeof catalogData[0]> = {};

  catalogData.forEach(book => {
    const rubrics = getBookRubrics(book);
    rubrics.forEach(rubric => {
      rubricCounts[rubric] = (rubricCounts[rubric] || 0) + 1;
      if (!rubricMostValuable[rubric] || book.price > rubricMostValuable[rubric].price) {
        rubricMostValuable[rubric] = book;
      }
    });
  });

  // Get list of rubrics present in dataset, sorted by volume count descending
  const activeRubrics = Object.keys(rubricCounts).sort((a, b) => rubricCounts[b] - rubricCounts[a]);
  const displayedRubrics = showAllRubrics ? activeRubrics : activeRubrics.slice(0, 10);

  const [premiumShowcase, setPremiumShowcase] = useState<typeof catalogData[0][]>([]);

  useEffect(() => {
    // Filter to ensure only unique books by keying of lowercase title and author to avoid duplicates
    const uniqueMap = new Map<string, typeof catalogData[0]>();
    catalogData.forEach(book => {
      const key = `${book.author || ''}_${book.title || ''}`.toLowerCase().replace(/\s+/g, '');
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, book);
      } else {
        const existing = uniqueMap.get(key)!;
        if (book.price > existing.price) {
          uniqueMap.set(key, book);
        }
      }
    });

    const uniqueBooksSorted = Array.from(uniqueMap.values()).sort((a, b) => b.price - a.price);
    
    // We select from the top 60 most valuable unique books to guarantee we get elite masterpieces,
    // but we shuffle them completely to show a rich, dynamic and surprising variety of random topics/eras on every load!
    const candidates = uniqueBooksSorted.slice(0, 60);
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    setPremiumShowcase(shuffled.slice(0, 3));
  }, []);

  // Filter books
  const filteredBooks = catalogData.filter((book) => {
    const term = searchTerm.toLowerCase();
    
    // Search in title, author, description, condition, or even rubric labels
    const rubrics = getBookRubrics(book);
    const rubricLabels = rubrics.map(r => RUBRICS_MAP[r]?.toLowerCase() || '').join(' ');
    
    const matchesSearch = 
      (book.title && book.title.toLowerCase().includes(term)) || 
      (book.author && book.author.toLowerCase().includes(term)) ||
      (book.description && book.description.toLowerCase().includes(term)) ||
      (book.condition && book.condition.toLowerCase().includes(term)) ||
      rubricLabels.includes(term);

    // Filter by rubric code
    const matchesRubric = selectedRubric === 'All' || rubrics.includes(selectedRubric);

    // Filter by general era category
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

    return matchesSearch && matchesRubric && matchesCategory;
  });

  // Sort filtered books
  const sortedBooks = [...filteredBooks];
  if (sortBy === 'price-desc') {
    sortedBooks.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'price-asc') {
    sortedBooks.sort((a, b) => a.price - b.price);
  }

  const visibleBooks = sortedBooks.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const handleAlibSearch = (e: React.MouseEvent, book: any) => {
    e.preventDefault();
    
    // Clean string from punctuation to search optimally on Alib and prevent submission errors
    const isAuthorUnknown = !book.author || 
      /автор\s+не\s+указан|нет\s+автора|не\s+указан|unknown|автор/i.test(book.author);
    const safeAuthor = isAuthorUnknown ? "" : (book.author || '').replace(/[.,/#!$%^&*;:{}=\-_`~()–—]/g, " ");
    const safeTitle = (book.title || '').replace(/[.,/#!$%^&*;:{}=\-_`~()–—]/g, " ");
    const safeYear = (book.year || '').replace(/[.,/#!$%^&*;:{}=\-_`~()–—]/g, " ");
    
    const query = `${safeAuthor} ${safeTitle} ${safeYear}`
      .replace(/\s+/g, " ")
      .trim();
    
    // Create clean programmatic form to force Windows-1251 CP1251 encoding in browser
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
    <section id="catalog" className="py-24 bg-brand-paper text-brand-text">
      <div className="container mx-auto px-4">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-brand-dark rounded-full mb-6 relative">
            <BookIcon className="text-brand-primary" size={24} />
            <div className="absolute inset-0 bg-brand-primary/10 rounded-full animate-ping pointer-events-none"></div>
          </div>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-brand-dark mb-4 uppercase tracking-tight">Каталог и рубрики</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Оцифрованная база нашего салона. Выберите тему, изучите редкие фолианты и экспонаты, а затем перейдите непосредственно к безопасной сделке.
          </p>
        </div>

        {/* --- DYNAMIC PREMIUM RARE BOOKS CAROUSEL/SHOWCASE --- */}
        {searchTerm === '' && selectedRubric === 'All' && selectedCategory === 'All' && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-brand-primary animate-pulse" size={24} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight uppercase">
                Гордость экспозиции (Шедевры коллекции)
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {premiumShowcase.map((book, idx) => {
                const rubrics = getBookRubrics(book);
                const firstRubricLabel = rubrics.length > 0 ? RUBRICS_MAP[rubrics[0]] : book.category;
                
                return (
                  <div key={`premium-${book.id}-${idx}`} className="relative bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-2 border-brand-primary/40 rounded-lg p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden group hover:border-brand-primary transition-all duration-300">
                    {/* Decorative gold background gradient flare */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full filter blur-xl pointer-events-none transition-all group-hover:bg-brand-primary/10"></div>
                    
                    <div>
                      {/* Badge */}
                      <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold tracking-widest uppercase bg-brand-primary text-brand-dark rounded-sm mb-4">
                        {firstRubricLabel || 'Реликвия'}
                      </span>
                      
                      <div className="flex gap-4 md:gap-5 mb-5 items-start">
                        {/* Book Image */}
                        <div className="w-24 aspect-[3/4] flex-shrink-0 bg-brand-dark rounded overflow-hidden shadow-md border border-white/10">
                          <BookCover 
                            book={book} 
                            className="w-full h-full opacity-90 transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        
                        {/* Meta */}
                        <div className="flex-1">
                          <h4 className="font-serif text-lg font-bold text-white leading-tight mb-1 line-clamp-3 group-hover:text-brand-primary transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-gray-300 text-xs italic font-semibold">{book.author}</p>
                          <p className="text-brand-primary/80 text-[11px] font-bold mt-1">Год издания: {book.year}</p>
                        </div>
                      </div>
                      
                      <div className="text-gray-300 text-xs leading-relaxed mb-6 bg-white/5 p-3 rounded border border-white/5 line-clamp-3">
                        {book.description || "Редчайший образец высокой букинистической ценности."}
                      </div>
                    </div>
                    
                    {/* Action Panel */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Ценность раритета</span>
                        <span className="text-xl font-extrabold text-brand-primary font-mono">
                          {new Intl.NumberFormat('ru-RU').format(book.price)} ₽
                        </span>
                      </div>
                      
                      <a 
                        href="#"
                        onClick={(e) => handleAlibSearch(e, book)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-primary to-[#d6b783] text-brand-dark hover:from-white hover:to-white hover:text-brand-dark text-xs uppercase tracking-wider font-extrabold shadow-lg rounded-sm transition-all active:scale-95"
                      >
                        Заказать на Alib ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- GLOBAL ALIB.RU INTEGRATION WIDGET --- */}
        <div className="relative overflow-hidden rounded-lg bg-brand-dark border border-brand-primary/30 p-8 md:p-10 mb-16 shadow-[0_4px_30px_rgba(0,0,0,0.15)] text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/5 rounded-full border border-brand-primary/10 pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-paper/5 rounded-full border border-dashed border-white/5 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-brand-primary/20 pb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Полный каталог на Alib.ru</span>
                <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1 uppercase tracking-tight">Поиск по более 10 000 редких книг</h3>
              </div>
              <a 
                href="https://www.alib.ru/bs.php4?bs=Sputnik" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-brand-primary hover:text-white border border-brand-primary/30 hover:border-brand-primary px-5 py-2.5 rounded-sm text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap bg-brand-surface/30"
              >
                Открыть всю витрину Sputnik ↗
              </a>
            </div>

            <p className="text-gray-300 text-sm mb-6 max-w-3xl leading-relaxed">
              Наш салон размещает полный ассортимент редких изданий и автографов на ведущем букинистическом портале <strong>Alib.ru</strong>. Поиск ниже будет произведен автоматически <strong>только по нашему магазину («Sputnik»)</strong>, без лишних посредников.
            </p>

            <form 
              action="https://www.alib.ru/find3.php4" 
              method="GET" 
              target="_blank"
              acceptCharset="windows-1251"
              className="space-y-4"
            >
              <input type="hidden" name="bsonly" value="Sputnik" />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="tfind"
                    required
                    placeholder="Введите автора, название, ключевые слова..."
                    className="w-full pl-12 pr-4 py-4 bg-brand-surface border border-brand-primary/20 hover:border-brand-primary/50 focus:border-brand-primary rounded-sm text-white placeholder-gray-400 text-base focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" size={22} />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-brand-primary to-[#d6b783] hover:from-white hover:to-white text-brand-dark hover:text-brand-dark/90 font-bold uppercase tracking-wider text-sm transition-all shadow-md rounded-sm whitespace-nowrap"
                >
                  Найти на Alib.ru ↗
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-brand-secondary">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-brand-primary">
                  <input 
                    type="checkbox" 
                    name="bsonly_dummy" 
                    defaultChecked 
                    disabled 
                    className="rounded border-brand-primary/50 bg-brand-dark text-brand-primary focus:ring-brand-primary h-4 w-4" 
                  />
                  Только у этого продавца (Sputnik)
                </label>
                <span className="text-gray-500">|</span>
                <span className="italic">Все книги зарезервированы за салоном Спутник. Для покупки свяжитесь с нами напрямую!</span>
              </div>
            </form>
          </div>
        </div>

        {/* --- DYNAMIC DIRECTORY AND FILTERS --- */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 mt-12 items-start" id="showcase">
          
          {/* --- LEFT SIDEBAR: THEMATIC RUBRICS --- */}
          <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 xl:sticky xl:top-24 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Filter className="text-brand-primary" size={18} />
                <h4 className="font-sans font-bold text-brand-dark uppercase text-xs tracking-wider">Каталог рубрик</h4>
              </div>
              <span className="text-[10px] bg-brand-primary/15 text-brand-primary font-extrabold px-1.5 py-0.5 rounded">
                {activeRubrics.length} тем
              </span>
            </div>

            {/* Rubrics Scrolling List */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-1.5 max-h-[30rem] xl:max-h-[50vh] scrollbar-thin">
              <button
                onClick={() => {
                  setSelectedRubric('All');
                  setVisibleCount(12);
                }}
                className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-all flex items-center justify-between font-bold uppercase tracking-wider ${
                  selectedRubric === 'All'
                    ? 'bg-brand-dark text-brand-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                }`}
              >
                <span>Все рубрики</span>
                <span className="font-mono text-[10px] opacity-70">({catalogData.length})</span>
              </button>

              {displayedRubrics.map((rubricCode) => {
                const label = RUBRICS_MAP[rubricCode] || rubricCode;
                const count = rubricCounts[rubricCode] || 0;
                
                return (
                  <button
                    key={`rubric-btn-${rubricCode}`}
                    onClick={() => {
                      setSelectedRubric(rubricCode);
                      setVisibleCount(12);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-all flex items-center justify-between ${
                      selectedRubric === rubricCode
                        ? 'bg-brand-primary text-brand-dark font-extrabold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                    }`}
                    title={label}
                  >
                    <span className="truncate pr-2">{label}</span>
                    <span className="font-mono text-[10px] opacity-70 flex-shrink-0">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Expand / Collapse Rubrics */}
            {activeRubrics.length > 10 && (
              <button
                onClick={() => setShowAllRubrics(!showAllRubrics)}
                className="mt-4 w-full py-2 border border-dashed border-gray-200 hover:border-brand-primary text-brand-primary hover:text-brand-dark text-center text-[11px] font-extrabold uppercase transition-all flex items-center justify-center gap-1 flex-shrink-0 rounded-sm"
              >
                {showAllRubrics ? 'Свернуть рубрики' : `Показать все (${activeRubrics.length})`}
                <ChevronRight size={14} className={`transform transition-transform ${showAllRubrics ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>

          {/* --- RIGHT PANEL: EXHIBITION GRID --- */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* SEARCH AND CONTROLS */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full md:flex-1">
                  <input
                    type="text"
                    placeholder="Поиск по автору, названию, описанию или рубрике..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setVisibleCount(12);
                    }}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50 text-brand-text text-sm"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* General category selectors */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-hide">
                  {['All', 'Antique', 'Soviet', 'Art', 'Autograph', 'Technical'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setVisibleCount(12);
                      }}
                      className={`px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-brand-dark text-brand-primary shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat === 'All' ? 'Все эпохи' : cat === 'Antique' ? 'Антиквариат' : cat === 'Soviet' ? 'СССР' : cat === 'Autograph' ? 'Автографы' : cat === 'Technical' ? 'Технические' : 'Искусство'}
                    </button>
                  ))}
                </div>

              </div>

              {/* Filtering metadata row */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center text-xs text-gray-500 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-700">Фильтры:</span>
                  {selectedRubric !== 'All' && (
                    <span className="bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      Рубрика: {RUBRICS_MAP[selectedRubric] || selectedRubric}
                      <button onClick={() => setSelectedRubric('All')} className="hover:text-brand-dark font-extrabold">×</button>
                    </span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span className="bg-brand-dark/10 text-brand-dark font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      Эпоха: {selectedCategory}
                      <button onClick={() => setSelectedCategory('All')} className="hover:text-brand-primary font-extrabold">×</button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      Текст: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:text-red-500 font-extrabold">×</button>
                    </span>
                  )}
                  {selectedRubric === 'All' && selectedCategory === 'All' && !searchTerm && (
                    <span className="italic text-gray-400">Показывается весь каталог</span>
                  )}
                </div>
                <div className="flex items-center gap-4 ml-auto flex-wrap">
                  {/* Sort Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-medium">Сортировка:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-gray-100 border border-gray-200 text-brand-dark text-[11px] font-bold rounded-sm py-1 px-2.5 focus:outline-none focus:border-brand-primary hover:border-gray-300 transition-colors cursor-pointer animate-fade-in"
                    >
                      <option value="default">По умолчанию</option>
                      <option value="price-desc">Сначала дорогие ↓</option>
                      <option value="price-asc">Сначала дешевые ↑</option>
                    </select>
                  </div>
                  <span className="font-semibold text-brand-dark text-xs">Найдено: {filteredBooks.length} шт.</span>
                </div>
              </div>
            </div>

            {/* EXHIBITS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleBooks.map((book, idx) => {
                const rubrics = getBookRubrics(book);
                const rubricLabel = rubrics.length > 0 ? RUBRICS_MAP[rubrics[0]] : book.category;
                
                return (
                  <div key={`book-${book.id}-${idx}`} className="group bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-primary/30 flex flex-col h-full transform hover:-translate-y-1">
                    <div className="relative aspect-[3/4] overflow-hidden bg-brand-surface border-b border-gray-100">
                      <BookCover 
                        book={book} 
                        className="w-full h-full opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-102"
                      />
                      
                      {/* Rubric Badge */}
                      <div className="absolute top-2 left-2 bg-brand-dark/80 backdrop-blur-xs text-brand-primary text-[9px] uppercase tracking-widest font-extrabold px-2 py-1 shadow rounded-sm border border-brand-primary/20 max-w-[200px] truncate" title={rubricLabel}>
                        {rubricLabel}
                      </div>

                      <div className="absolute top-2 right-2 bg-brand-primary text-brand-dark text-[10px] font-extrabold px-2 py-1 shadow-md rounded-sm">
                        {book.year}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1.5">
                         <h3 className="font-serif text-base font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors line-clamp-2" title={book.title}>
                           {book.title}
                         </h3>
                      </div>
                      <p className="text-gray-600 font-medium mb-3 text-xs italic">{book.author || 'Автор неизвестен'}</p>
                      
                      {/* Description / Description text block */}
                      <div className="text-gray-500 text-[11px] mb-4 line-clamp-3 leading-relaxed flex-1 bg-gray-50/70 p-2 border border-gray-100 rounded">
                        {book.description || 'Редкое издание. Дополнительную информацию и состояние книги уточняйте по запросу.'}
                        {book.condition && (
                          <div className="mt-1.5 pt-1.5 border-t border-gray-200/50 text-brand-dark font-medium">
                            <span className="font-bold text-[10px] text-gray-400 block uppercase">Состояние:</span>
                            {book.condition}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                           <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Стоимость</p>
                           <span className="font-bold text-lg text-brand-dark shrink-0">
                             {new Intl.NumberFormat('ru-RU').format(book.price)} ₽
                           </span>
                        </div>

                        {/* Order button click redirects directly to Alib search filtered by seller Sputnik and book query details */}
                        <a
                          href="#"
                          onClick={(e) => handleAlibSearch(e, book)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-dark border border-brand-primary/20 hover:border-brand-primary text-brand-primary hover:text-white text-[10px] uppercase tracking-widest font-extrabold rounded-sm transition-all shadow-xs"
                        >
                          Заказать ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LOAD MORE */}
            {visibleBooks.length < filteredBooks.length && (
              <div className="text-center pt-6">
                <button 
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-white border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-all rounded-sm uppercase text-xs font-bold tracking-widest hover:shadow-md"
                >
                  Показать еще ({filteredBooks.length - visibleBooks.length})
                </button>
              </div>
            )}

            {/* NO GRAPHICS FOUND */}
            {filteredBooks.length === 0 && (
              <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <BookIcon size={40} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm font-medium">По заданным фильтрам книг не найдено.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedRubric('All'); setSelectedCategory('All');}}
                  className="mt-3 text-brand-primary hover:underline text-xs font-bold uppercase tracking-wider"
                >
                  Сбросить поисковые фильтры
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default Catalog;
