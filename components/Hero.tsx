import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-dark">
      
      {/* Abstract Space Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* The Big Moon/Planet Circle from the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-brand-paper rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-brand-primary/10 rounded-full border border-brand-primary/20 animate-orbit-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dashed border-white/10 rounded-full animate-orbit"></div>
        
        {/* Stars */}
        <div className="absolute top-1/4 left-1/4 text-brand-primary opacity-40"><Star size={12} /></div>
        <div className="absolute bottom-1/4 right-1/4 text-brand-primary opacity-60"><Star size={16} /></div>
        <div className="absolute top-1/3 right-10 text-white opacity-20"><Star size={8} /></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in-up flex flex-col items-center">
          
          {/* Sputnik Logo/Graphic Representation */}
          <div className="mb-8 relative">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[0_0_50px_rgba(197,165,114,0.3)] flex items-center justify-center relative z-10">
                {/* Stylized lines on the "moon" */}
                <div className="absolute w-[120%] h-[1px] bg-brand-primary/50 rotate-45"></div>
                <div className="absolute w-[120%] h-[1px] bg-brand-primary/50 -rotate-12"></div>
                <div className="absolute w-3 h-3 bg-brand-dark rounded-full top-8 right-8"></div>
             </div>
             {/* Orbit rings */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[60%] border border-brand-primary/60 rounded-[100%] -rotate-12 pointer-events-none"></div>
          </div>

          <h2 className="text-brand-primary uppercase tracking-[0.5em] text-xs md:text-sm mb-6 font-bold">
            Москва • Ленинский Проспект 32
          </h2>
          
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight text-white uppercase tracking-wider">
            Спутник
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8">
             <span className="h-[1px] w-12 bg-brand-primary"></span>
             <p className="text-lg md:text-2xl font-serif italic text-gray-300">
               Антикварно-букинистический салон
             </p>
             <span className="h-[1px] w-12 bg-brand-primary"></span>
          </div>

          <p className="text-base md:text-lg max-w-xl mx-auto text-gray-400 mb-10 leading-relaxed font-light">
            Редкие книги, автографы и предметы коллекционирования. 
            <br/>Место притяжения для ценителей истории.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
            <a 
              href="#catalog" 
              className="px-8 py-4 bg-brand-primary text-brand-dark hover:bg-white hover:text-brand-dark transition-all duration-300 rounded-sm font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,165,114,0.2)]"
            >
              Каталог
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 border border-brand-primary/30 hover:bg-brand-primary/10 text-brand-primary transition-all duration-300 rounded-sm font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              Контакты
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;