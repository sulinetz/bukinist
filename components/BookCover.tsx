import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface BookCoverProps {
  book: Book;
  className?: string;
}

// Generate a deterministic background color based on the book id or title
const getVintageStyle = (book: Book) => {
  const hash = book.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const styles = [
    {
      bg: 'bg-gradient-to-br from-[#4A1E29] to-[#2B0F15]', // Red Wine Burgundy
      text: 'text-[#F1E4C3]',
      accent: 'text-[#C5A572]',
      border: 'border-[#C5A572]/40',
      ornament: '✦ ⚜ ✦'
    },
    {
      bg: 'bg-gradient-to-br from-[#1C3A27] to-[#0A1A10]', // Royal Forest Green
      text: 'text-[#E3ECC5]',
      accent: 'text-[#87A96B]',
      border: 'border-[#87A96B]/40',
      ornament: '✦ ❦ ✦'
    },
    {
      bg: 'bg-gradient-to-br from-[#1E2E3E] to-[#0B1520]', // Classic Academy Navy
      text: 'text-[#E2EAF4]',
      accent: 'text-[#C5A572]',
      border: 'border-[#C5A572]/40',
      ornament: '✦ ⚜ ✦'
    },
    {
      bg: 'bg-gradient-to-br from-[#4A3B32] to-[#2B1F17]', // Antique Leather Brown
      text: 'text-[#F1E4C3]',
      accent: 'text-[#D4AF37]',
      border: 'border-[#D4AF37]/40',
      ornament: '✦ ❀ ✦'
    },
    {
      bg: 'bg-gradient-to-br from-[#2D2D3A] to-[#16161D]', // Imperial Charcoal
      text: 'text-[#E2E8F0]',
      accent: 'text-[#C5A572]',
      border: 'border-[#C5A572]/30',
      ornament: '✦ ⚜ ✦'
    }
  ];

  return styles[hash % styles.length];
};

const BookCover: React.FC<BookCoverProps> = ({ book, className = "w-full h-full" }) => {
  const [hasError, setHasError] = useState(false);

  // Directly fallback if URL is empty or uses the known dead img-fotki domain
  const isUrlBroken = !book.coverUrl || 
    book.coverUrl.includes('img-fotki.yandex.ru') || 
    book.coverUrl.includes('placeholder') ||
    book.coverUrl.trim() === '';

  useEffect(() => {
    // Reset error state if the coverUrl changes
    setHasError(false);
  }, [book.coverUrl]);

  if (hasError || isUrlBroken) {
    const style = getVintageStyle(book);
    
    return (
      <div 
        id={`virtual-cover-${book.id}`}
        className={`relative ${className} ${style.bg} flex flex-col justify-between p-4 border border-brand-primary/20 select-none shadow-inner overflow-hidden flex-shrink-0`}
      >
        {/* Soft textured noise background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        
        {/* Academic Double Ornate Gold Frame */}
        <div className={`absolute inset-2 border ${style.border} pointer-events-none`}>
          <div className={`absolute inset-0.5 border-2 ${style.border} pointer-events-none opacity-40`} />
        </div>

        {/* Top Header - Spine Info */}
        <div className="relative text-[9px] uppercase tracking-widest text-center opacity-60 font-sans font-extrabold mt-1 truncate">
          СПУТНИК БУКИНИСТ
        </div>

        {/* Main Title Center */}
        <div className="relative my-auto flex flex-col items-center justify-center text-center px-1">
          {/* Author */}
          {book.author && (
            <p className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-gray-400 mb-2 truncate max-w-full">
              {book.author.replace(/[.,/#!$%^&*;:{}=\-_`~()–—]/g, "").trim().substring(0, 30)}
            </p>
          )}

          {/* Golden Ornament divider */}
          <div className={`text-[10px] ${style.accent} mb-2.5 opacity-80 select-none`}>
            {style.ornament}
          </div>

          {/* Book Title */}
          <h4 className="font-serif text-xs md:text-sm font-bold text-white tracking-wide leading-snug line-clamp-4 px-1 max-h-[70px] overflow-hidden">
            {book.title}
          </h4>
        </div>

        {/* Bottom Year & Catalog Details */}
        <div className="relative flex flex-col items-center justify-center text-center pb-1">
          <div className={`w-8 h-[1px] ${style.accent} opacity-30 mb-2`} />
          <span className="font-serif italic text-[10px] font-medium text-gray-300">
            {book.year ? `${book.year} г.` : 'Издание'}
          </span>
          <span className="font-mono text-[7px] text-gray-500 mt-1 opacity-75">
            LOT #{book.id.toUpperCase().substring(0, 7)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img 
      id={`live-cover-${book.id}`}
      src={book.coverUrl} 
      alt={book.title}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${className} object-cover`}
    />
  );
};

export default BookCover;
