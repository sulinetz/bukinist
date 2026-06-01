import React, { useState, useEffect } from 'react';
import { Menu, X, Satellite } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'О нас', href: '#about' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Услуги', href: '#services' },
  { label: 'Аукцион', href: '#auction' },
  { label: 'Контакты', href: '#contact' },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled || mobileMenuOpen
          ? 'bg-brand-dark/95 backdrop-blur-md border-brand-primary/20 py-3 shadow-xl' 
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className={`p-2 rounded-full border border-brand-primary/30 group-hover:border-brand-primary/80 transition-colors ${isScrolled ? 'bg-brand-dark' : 'bg-brand-dark/50'}`}>
            <Satellite size={24} className="text-brand-primary" />
          </div>
          <div>
            <h1 className={`font-sans text-xl md:text-2xl font-bold leading-none tracking-wide uppercase ${isScrolled ? 'text-white' : 'text-white'}`}>
              Спутник
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand-primary font-medium">
              Букинист • Москва
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className={`font-medium transition-colors text-sm uppercase tracking-widest hover:text-brand-primary ${
                isScrolled ? 'text-gray-300' : 'text-gray-200'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-brand-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-dark border-b border-brand-primary/20 shadow-2xl py-6">
          <nav className="flex flex-col items-center gap-6">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                className="text-white text-lg font-medium uppercase tracking-widest hover:text-brand-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;